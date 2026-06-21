import * as THREE from 'three'
import { Gallery } from '@/Experience/Gallery'
import { Background } from '@/Experience/Background'

class Experience {
  constructor() {
    this.isInitialized = false
    this.isDisposed = false
    this.gallery = new Gallery()
    this.background = new Background()
  }

  async init(scene, camera) {
    if (this.isInitialized) return

    await this.gallery.init(scene)
    this.background.init()

    this.isInitialized = true
  }

  update(time, camera = null, scroll = null) {
    this.gallery.update(camera, scroll)

    if (camera) {
      const moodBlendData = this.gallery.getMoodBlendData(camera.position.z)
      if (moodBlendData) {
        this.background.setMoodBlend(moodBlendData)
      }

      const depthProgress = this.gallery.getDepthProgress(camera.position.z)
      const velocityMax = scroll?.velocityMax || 1
      const velocityIntensity = THREE.MathUtils.clamp(
        Math.abs(scroll?.velocity || 0) / Math.max(velocityMax, 0.0001),
        0,
        1
      )
      const planeBlendData = this.gallery.getPlaneBlendData(camera.position.z)
      const blend = planeBlendData?.blend ?? 0
      const distanceFromBlendCenter = Math.abs(blend - 0.5) * 2
      const transitionStability = THREE.MathUtils.smoothstep(distanceFromBlendCenter, 0.35, 1)
      const stabilizedVelocityIntensity = velocityIntensity * transitionStability

      this.background.setMotionResponse({
        depthProgress,
        velocityIntensity: stabilizedVelocityIntensity,
      })
    }

    this.background.update(time)
  }

  dispose() {
    if (this.isDisposed) return

    this.gallery.dispose()
    this.background.dispose()
    this.isDisposed = true
  }
}

const world = new Experience()
export { Experience, world }
