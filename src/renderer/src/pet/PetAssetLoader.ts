import { Assets, type Texture } from 'pixi.js'
import {
  parsePetManifest,
  resolveAssetPath,
  type PetManifest
} from './PetManifest'

export interface LoadedPetAnimation {
  readonly textures: readonly Texture[]
  readonly fps: number
  readonly loop: boolean
}

export interface LoadedPetAsset {
  readonly manifest: PetManifest
  readonly animations: Readonly<Record<string, LoadedPetAnimation>>
}

export class PetAssetLoadError extends Error {
  constructor(
    message: string,
    readonly userMessage = '宠物动画暂时无法显示'
  ) {
    super(message)
    this.name = 'PetAssetLoadError'
  }
}

export class PetAssetLoader {
  private readonly loadedTextureUrls = new Set<string>()

  constructor(
    private readonly fetchManifest: typeof fetch = (input, init) =>
      fetch(input, init),
    private readonly loadTexture: (url: string) => Promise<Texture> = (url) =>
      Assets.load<Texture>(url),
    private readonly unloadTexture: (url: string) => Promise<void> = async (
      url
    ) => {
      await Assets.unload(url)
    }
  ) {}

  async load(manifestUrl: string): Promise<LoadedPetAsset> {
    let response: Response

    try {
      response = await this.fetchManifest(manifestUrl)
    } catch (error) {
      throw new PetAssetLoadError(
        `Failed to load pet manifest: ${this.describeError(error)}`
      )
    }

    if (!response.ok) {
      throw new PetAssetLoadError(
        `Failed to load pet manifest: HTTP ${response.status}`
      )
    }

    let manifest: PetManifest

    try {
      manifest = parsePetManifest(await response.json())
    } catch (error) {
      throw new PetAssetLoadError(
        `Invalid pet manifest: ${this.describeError(error)}`
      )
    }

    try {
      const animationEntries: Array<readonly [string, LoadedPetAnimation]> = []

      for (const [name, animation] of Object.entries(manifest.animations)) {
        const frameUrls = animation.frames.map((frame) =>
          resolveAssetPath(manifestUrl, frame)
        )
        const results = await Promise.allSettled(
          frameUrls.map((url) => this.loadTexture(url))
        )
        const textures: Texture[] = []
        let frameError: unknown

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            this.loadedTextureUrls.add(frameUrls[index])
            textures.push(result.value)
          } else {
            frameError ??= result.reason
          }
        })

        if (frameError) {
          throw frameError
        }

        animationEntries.push([
          name,
          { textures, fps: animation.fps, loop: animation.loop }
        ])
      }

      const animations = Object.fromEntries(animationEntries)

      return { manifest, animations }
    } catch (error) {
      await this.dispose()
      throw new PetAssetLoadError(
        `Failed to load pet animation frame: ${this.describeError(error)}`
      )
    }
  }

  async dispose(): Promise<void> {
    const urls = [...this.loadedTextureUrls]
    this.loadedTextureUrls.clear()
    await Promise.allSettled(urls.map((url) => this.unloadTexture(url)))
  }

  private describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error)
  }
}
