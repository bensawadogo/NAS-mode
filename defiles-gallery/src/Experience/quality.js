/*
 * Detection du niveau de qualite.
 *
 * La galerie reste immersive sur TOUS les appareils : on ne retire jamais
 * le WebGL, on adapte la charge. Trois niveaux, du plus contraint au moins
 * contraint, choisis a partir de la memoire, de la connexion et du GPU.
 *
 * Cible : telephones Android 1-2 Go de RAM en 3G a Ouagadougou, sans
 * degrader l'experience sur desktop.
 */

const TIERS = { LOW: 'low', MID: 'mid', HIGH: 'high' }

function connection() {
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection || null
}

/** Connexion lente ou economiseur de donnees actif. */
function isConstrainedNetwork() {
  const c = connection()
  if (!c) return false
  if (c.saveData === true) return true
  return ['slow-2g', '2g', '3g'].indexOf(c.effectiveType) !== -1
}

/** Memoire annoncee par l'appareil, en Go. `undefined` sur Safari/Firefox. */
function deviceMemory() {
  const m = navigator.deviceMemory
  return typeof m === 'number' && m > 0 ? m : null
}

/**
 * Certains GPU mobiles anciens plafonnent la taille de texture a 4096 et
 * n'ont que 2 unites de texture utiles. C'est un bon indicateur d'entree
 * de gamme quand deviceMemory n'est pas expose.
 */
function gpuHint(gl) {
  if (!gl) return null
  try {
    const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE)
    if (maxTex && maxTex <= 4096) return 'weak'
    return 'ok'
  } catch (e) {
    return null
  }
}

/**
 * @param {WebGLRenderingContext|WebGL2RenderingContext|null} gl
 * @returns {{tier: string, textureKey: string, pixelRatio: number, antialias: boolean, mipmaps: boolean, initialBatch: number}}
 */
function detectQuality(gl) {
  const mem = deviceMemory()
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
  const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches
  const slow = isConstrainedNetwork()
  const gpu = gpuHint(gl)
  const cores = typeof navigator.hardwareConcurrency === 'number' ? navigator.hardwareConcurrency : null

  let tier = TIERS.HIGH

  // Bas de gamme : peu de memoire, GPU faible, ou reseau contraint.
  if ((mem !== null && mem <= 2) || gpu === 'weak' || slow || (cores !== null && cores <= 4 && coarse)) {
    tier = TIERS.LOW
  } else if ((mem !== null && mem < 8) || coarse || narrow) {
    tier = TIERS.MID
  }

  const profils = {
    low: { textureKey: 'low', pixelRatio: 1.5, antialias: false, mipmaps: false, initialBatch: 3 },
    mid: { textureKey: 'mid', pixelRatio: 2, antialias: true, mipmaps: true, initialBatch: 4 },
    high: { textureKey: 'high', pixelRatio: 2, antialias: true, mipmaps: true, initialBatch: 6 },
  }

  return Object.assign({ tier }, profils[tier])
}

export { detectQuality, TIERS, isConstrainedNetwork, deviceMemory }
