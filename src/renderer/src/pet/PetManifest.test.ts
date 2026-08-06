import { describe, expect, it } from 'vitest'
import {
  MAXIMUM_ANIMATION_FPS,
  MINIMUM_ANIMATION_FPS,
  parsePetManifest,
  PetManifestValidationError,
  resolveAssetPath
} from './PetManifest'

const createManifest = (fps = 8, frames = ['idle/idle_0001.png']) => ({
  petId: 'placeholder-dog',
  displayName: 'Placeholder Dog',
  version: 1,
  canvas: { width: 512, height: 512 },
  anchor: { x: 0.5, y: 1 },
  alignment: 'bottom-center',
  hitbox: { x: 116, y: 116, width: 280, height: 344 },
  animations: {
    idle: { frames, fps, loop: true }
  }
})

describe('parsePetManifest', () => {
  it('validates and returns a complete pet manifest', () => {
    const manifest = parsePetManifest(createManifest())

    expect(manifest.petId).toBe('placeholder-dog')
    expect(manifest.animations.idle?.frames).toEqual([
      'idle/idle_0001.png'
    ])
  })

  it('rejects malformed manifest fields', () => {
    expect(() =>
      parsePetManifest({ ...createManifest(), canvas: { width: 0, height: 512 } })
    ).toThrow(PetManifestValidationError)
  })

  it('rejects an empty animation frame list', () => {
    expect(() => parsePetManifest(createManifest(8, []))).toThrow(
      'animations.idle.frames must not be empty'
    )
  })

  it('accepts only FPS values inside the supported range', () => {
    expect(parsePetManifest(createManifest(MINIMUM_ANIMATION_FPS))).toBeTruthy()
    expect(parsePetManifest(createManifest(MAXIMUM_ANIMATION_FPS))).toBeTruthy()
    expect(() => parsePetManifest(createManifest(0))).toThrow()
    expect(() =>
      parsePetManifest(createManifest(MAXIMUM_ANIMATION_FPS + 1))
    ).toThrow()
  })
})

describe('resolveAssetPath', () => {
  it('resolves frame paths relative to the manifest location', () => {
    expect(
      resolveAssetPath(
        'http://localhost:5173/pets/placeholder/manifest.json',
        'idle/idle_0001.png'
      )
    ).toBe('http://localhost:5173/pets/placeholder/idle/idle_0001.png')
  })

  it('rejects traversal and absolute asset paths', () => {
    expect(() => resolveAssetPath('file:///assets/manifest.json', '../x.png')).toThrow()
    expect(() => resolveAssetPath('file:///assets/manifest.json', 'https://x.test/x.png')).toThrow()
  })
})
