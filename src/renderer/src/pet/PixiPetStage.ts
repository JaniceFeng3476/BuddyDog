import 'pixi.js/unsafe-eval'
import { AnimatedSprite, Application, Rectangle, type Texture } from 'pixi.js'
import {
  PetAnimationController,
  type AnimationDefinition,
  type AnimationPlayer
} from './PetAnimationController'
import { PetAssetLoader } from './PetAssetLoader'
import type { PetHitbox } from './PetManifest'
import { calculatePetLayout } from './petLayout'

const PIXI_BASE_TICK_RATE = 60
const MAXIMUM_RENDER_FPS = 30

class PixiAnimationPlayer implements AnimationPlayer<Texture> {
  constructor(private readonly sprite: AnimatedSprite) {}

  configure(definition: AnimationDefinition<Texture>): void {
    this.sprite.stop()
    this.sprite.textures = [...definition.frames]
    this.sprite.animationSpeed = definition.fps / PIXI_BASE_TICK_RATE
    this.sprite.loop = definition.loop
    this.sprite.gotoAndStop(0)
  }

  play(): void {
    this.sprite.play()
  }

  stop(): void {
    this.sprite.stop()
  }

  destroy(): void {
    this.sprite.destroy({ texture: false, textureSource: false })
  }
}

export interface PixiPetStageOptions {
  readonly manifestUrl: string
  readonly onHitAreaChange: (hitArea: PetHitbox) => void
}

export class PixiPetStage {
  private readonly application = new Application()
  private readonly assetLoader = new PetAssetLoader()
  private animationController: PetAnimationController<Texture> | undefined
  private resizeObserver: ResizeObserver | undefined
  private sprite: AnimatedSprite | undefined
  private disposed = false
  private initialized = false

  constructor(
    private readonly container: HTMLElement,
    private readonly options: PixiPetStageOptions
  ) {}

  async initialize(): Promise<void> {
    try {
      await this.application.init({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        preference: 'webgl',
        resolution: window.devicePixelRatio
      })
      this.initialized = true

      if (this.disposed) {
        this.destroyApplication()
        return
      }

      this.application.ticker.maxFPS = MAXIMUM_RENDER_FPS
      this.application.canvas.className = 'pet-canvas'
      this.container.append(this.application.canvas)

      const asset = await this.assetLoader.load(this.options.manifestUrl)

      if (this.disposed) {
        await this.assetLoader.dispose()
        this.destroyApplication()
        return
      }

      const idle = asset.animations.idle

      if (!idle) {
        throw new Error('Required idle animation does not exist')
      }

      const sprite = new AnimatedSprite([...idle.textures])
      sprite.anchor.set(asset.manifest.anchor.x, asset.manifest.anchor.y)
      sprite.eventMode = 'none'
      sprite.hitArea = new Rectangle(
        asset.manifest.hitbox.x,
        asset.manifest.hitbox.y,
        asset.manifest.hitbox.width,
        asset.manifest.hitbox.height
      )
      this.sprite = sprite
      this.application.stage.addChild(sprite)

      const animations = Object.fromEntries(
        Object.entries(asset.animations).map(([name, animation]) => [
          name,
          {
            frames: animation.textures,
            fps: animation.fps,
            loop: animation.loop
          }
        ])
      )
      this.animationController = new PetAnimationController(
        animations,
        new PixiAnimationPlayer(sprite)
      )

      const updateLayout = (): void => {
        const width = this.container.clientWidth
        const height = this.container.clientHeight

        if (width === 0 || height === 0 || !this.sprite) {
          return
        }

        this.application.renderer.resize(width, height)
        const layout = calculatePetLayout(
          { width, height },
          asset.manifest.canvas,
          asset.manifest.anchor,
          asset.manifest.hitbox
        )
        this.sprite.position.set(layout.position.x, layout.position.y)
        this.sprite.scale.set(layout.scale)
        this.options.onHitAreaChange(layout.hitArea)
      }

      this.resizeObserver = new ResizeObserver(updateLayout)
      this.resizeObserver.observe(this.container)
      updateLayout()
      this.animationController.play('idle')
    } catch (error) {
      if (!this.disposed) {
        this.dispose()
      }
      throw error
    }
  }

  dispose(): void {
    if (this.disposed) {
      return
    }

    this.disposed = true
    this.resizeObserver?.disconnect()
    this.resizeObserver = undefined
    this.animationController?.destroy()
    this.animationController = undefined
    this.sprite = undefined
    this.destroyApplication()
    void this.assetLoader.dispose()
  }

  private destroyApplication(): void {
    if (!this.initialized) {
      return
    }

    this.application.destroy(
      { removeView: true },
      { children: true, texture: false, textureSource: false }
    )
    this.initialized = false
  }
}
