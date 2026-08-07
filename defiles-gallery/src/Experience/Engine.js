import * as THREE from 'three'
import { world } from '@/Experience/'
import { Scroll } from '@/Experience/Scroll'
import { detectQuality } from '@/Experience/quality'

/**
 * Sonde un contexte WebGL jetable pour interroger le GPU avant de
 * construire le vrai renderer : `antialias` n'est reglable qu'a la
 * construction, il faut donc connaitre le niveau de qualite avant.
 */
function probeGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return null
    // on libere immediatement le contexte de sonde
    const lose = gl.getExtension('WEBGL_lose_context')
    const params = { MAX_TEXTURE_SIZE: gl.MAX_TEXTURE_SIZE, getParameter: (p) => gl.getParameter(p) }
    const snapshot = { MAX_TEXTURE_SIZE: gl.getParameter(gl.MAX_TEXTURE_SIZE) }
    if (lose) lose.loseContext()
    return {
      MAX_TEXTURE_SIZE: params.MAX_TEXTURE_SIZE,
      getParameter: () => snapshot.MAX_TEXTURE_SIZE,
    }
  } catch (e) {
    return null
  }
}

class Engine {
  constructor(canvas, experience = world) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Engine requires a valid canvas element')
    }

    this.canvas = canvas
    this.experience = experience
    this.isInitialized = false
    this.isRunning = false
    this.animationFrameRequestId = null
    this.preloadedTextures = new Map()
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(0, 0, 8)

    this.scroll = new Scroll(this.camera, this.experience.gallery)

    // Niveau de qualite : la galerie reste immersive partout, seule la
    // charge s'adapte (taille des textures, antialiasing, densite de rendu).
    this.quality = detectQuality(probeGL())

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.quality.antialias,
      powerPreference: this.quality.tier === 'high' ? 'high-performance' : 'default',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.quality.pixelRatio))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.autoClear = false

    this.onResize = () => { this.resize() }
    this.animate = this.update.bind(this)
  }

  async init() {
    if (this.isInitialized) return

    document.body.classList.add('loading')

    try {
      const gallery = this.experience.gallery
      gallery.setQuality(this.quality)

      // On ne charge que les premiers visuels avant de rendre. Le
      // Promise.all sur les 27 textures faisait attendre ~2min40 en 3G
      // devant un ecran noir ; ici le premier rendu part des le premier
      // lot, le reste rejoint la scene pendant la navigation.
      const sources = gallery.getTextureSources()
      const premierLot = sources.slice(0, this.quality.initialBatch)
      this.preloadedTextures = await this.loadTextures(premierLot)
      gallery.setPreloadedTextures(this.preloadedTextures)

      await this.experience.init(this.scene, this.camera)
      this.scroll.init()

      this.resize()
      window.addEventListener('resize', this.onResize)
      this.scroll.bindEvents()

      this.isInitialized = true
      this.start()
    } finally {
      document.body.classList.remove('loading')
    }

    // Volontairement pas d'await : le rendu tourne deja.
    this.loadRemainingTextures()
  }

  /** Reglages de texture dependant du niveau (mipmaps = 33% de memoire GPU). */
  applyTextureSettings(texture) {
    texture.colorSpace = THREE.SRGBColorSpace
    if (!this.quality.mipmaps) {
      texture.generateMipmaps = false
      texture.minFilter = THREE.LinearFilter
    }
    texture.anisotropy = 1
    return texture
  }

  /** Charge un lot de textures en parallele. Une erreur n'interrompt pas le lot. */
  async loadTextures(sources) {
    const loadedTextures = this.preloadedTextures instanceof Map ? this.preloadedTextures : new Map()
    if (!sources || !sources.length) return loadedTextures

    const textureLoader = new THREE.TextureLoader()

    await Promise.all(
      sources.map(async (textureSource) => {
        try {
          const texture = await textureLoader.loadAsync(textureSource)
          loadedTextures.set(textureSource, this.applyTextureSettings(texture))
        } catch (error) {
          console.warn(`Texture failed to load: ${textureSource}`, error)
        }
      })
    )

    return loadedTextures
  }

  /**
   * Charge les textures restantes une par une et les attache au fur et a
   * mesure. Sequentiel a dessein : 27 requetes simultanees saturent une
   * connexion 3G et retardent tout le monde.
   */
  async loadRemainingTextures() {
    const gallery = this.experience.gallery
    const textureLoader = new THREE.TextureLoader()

    for (let index = 0; index < gallery.planeConfig.length; index += 1) {
      if (!this.isRunning) return

      const source = gallery.resolveTextureSrc(gallery.planeConfig[index])
      if (!source) continue

      if (this.preloadedTextures.has(source)) {
        gallery.attachTexture(index, this.preloadedTextures.get(source))
        continue
      }

      try {
        const texture = await textureLoader.loadAsync(source)
        this.applyTextureSettings(texture)
        this.preloadedTextures.set(source, texture)
        gallery.attachTexture(index, texture)
      } catch (error) {
        // Le plan garde sa couleur de repli : la scene reste coherente.
        console.warn(`Texture failed to load: ${source}`, error)
      }
    }
  }

  start() {
    if (!this.isInitialized || this.isRunning) return
    this.isRunning = true
    this.update()
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth || 1
    const height = this.canvas.clientHeight || window.innerHeight || 1
    if (width <= 0 || height <= 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)
    this.experience.gallery.updatePlaneScale()
    this.experience.gallery.layoutPlanes()
  }

  update() {
    if (!this.isRunning) return

    this.animationFrameRequestId = requestAnimationFrame(this.animate)
    const time = performance.now()

    this.scroll.update()
    this.experience.update(time, this.camera, this.scroll)

    this.renderer.clear(true, true, true)
    this.experience.background.render(this.renderer)
    this.renderer.clearDepth()
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.isRunning = false

    if (this.animationFrameRequestId !== null) {
      cancelAnimationFrame(this.animationFrameRequestId)
      this.animationFrameRequestId = null
    }

    window.removeEventListener('resize', this.onResize)
    this.scroll.dispose()

    this.preloadedTextures.forEach((texture) => { texture.dispose() })
    this.preloadedTextures.clear()
    this.experience.dispose?.()
  }
}

export { Engine }
