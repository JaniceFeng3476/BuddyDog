export const MINIMUM_ANIMATION_FPS = 1
export const MAXIMUM_ANIMATION_FPS = 30

export interface PetCanvasSize {
  readonly width: number
  readonly height: number
}

export interface PetPoint {
  readonly x: number
  readonly y: number
}

export interface PetHitbox extends PetPoint, PetCanvasSize {}

export interface PetAnimationManifest {
  readonly frames: readonly string[]
  readonly fps: number
  readonly loop: boolean
}

export interface PetManifest {
  readonly petId: string
  readonly displayName: string
  readonly version: number
  readonly canvas: PetCanvasSize
  readonly anchor: PetPoint
  readonly alignment: 'bottom-center'
  readonly hitbox: PetHitbox
  readonly animations: Readonly<Record<string, PetAnimationManifest>>
}

export class PetManifestValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PetManifestValidationError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const requireRecord = (
  value: unknown,
  fieldName: string
): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new PetManifestValidationError(`${fieldName} must be an object`)
  }

  return value
}

const requireNonEmptyString = (value: unknown, fieldName: string): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new PetManifestValidationError(`${fieldName} must be a non-empty string`)
  }

  return value
}

const requirePositiveNumber = (value: unknown, fieldName: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new PetManifestValidationError(`${fieldName} must be a positive number`)
  }

  return value
}

const requireNonNegativeNumber = (value: unknown, fieldName: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new PetManifestValidationError(`${fieldName} must be a non-negative number`)
  }

  return value
}

const requireNormalizedNumber = (value: unknown, fieldName: string): number => {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1
  ) {
    throw new PetManifestValidationError(`${fieldName} must be between 0 and 1`)
  }

  return value
}

export const isSafeAssetPath = (path: string): boolean => {
  if (
    path.length === 0 ||
    path.startsWith('/') ||
    path.startsWith('\\') ||
    path.includes('\\') ||
    path.includes(':')
  ) {
    return false
  }

  return path.split('/').every((segment) => segment !== '' && segment !== '..')
}

const parseAnimation = (
  value: unknown,
  fieldName: string
): PetAnimationManifest => {
  const animation = requireRecord(value, fieldName)

  if (!Array.isArray(animation.frames) || animation.frames.length === 0) {
    throw new PetManifestValidationError(`${fieldName}.frames must not be empty`)
  }

  const frames = animation.frames.map((frame, index) => {
    const path = requireNonEmptyString(frame, `${fieldName}.frames[${index}]`)

    if (!isSafeAssetPath(path)) {
      throw new PetManifestValidationError(
        `${fieldName}.frames[${index}] must be a safe relative path`
      )
    }

    return path
  })
  const fps = requirePositiveNumber(animation.fps, `${fieldName}.fps`)

  if (fps < MINIMUM_ANIMATION_FPS || fps > MAXIMUM_ANIMATION_FPS) {
    throw new PetManifestValidationError(
      `${fieldName}.fps must be between ${MINIMUM_ANIMATION_FPS} and ${MAXIMUM_ANIMATION_FPS}`
    )
  }

  if (typeof animation.loop !== 'boolean') {
    throw new PetManifestValidationError(`${fieldName}.loop must be a boolean`)
  }

  return { frames, fps, loop: animation.loop }
}

export const parsePetManifest = (value: unknown): PetManifest => {
  const manifest = requireRecord(value, 'manifest')
  const canvas = requireRecord(manifest.canvas, 'canvas')
  const anchor = requireRecord(manifest.anchor, 'anchor')
  const hitbox = requireRecord(manifest.hitbox, 'hitbox')
  const animations = requireRecord(manifest.animations, 'animations')
  const parsedAnimations = Object.fromEntries(
    Object.entries(animations).map(([name, animation]) => [
      requireNonEmptyString(name, 'animation name'),
      parseAnimation(animation, `animations.${name}`)
    ])
  )

  if (Object.keys(parsedAnimations).length === 0) {
    throw new PetManifestValidationError('animations must not be empty')
  }

  if (manifest.alignment !== 'bottom-center') {
    throw new PetManifestValidationError('alignment must be bottom-center')
  }

  const version = requirePositiveNumber(manifest.version, 'version')

  if (!Number.isInteger(version)) {
    throw new PetManifestValidationError('version must be an integer')
  }

  const parsedCanvas = {
    width: requirePositiveNumber(canvas.width, 'canvas.width'),
    height: requirePositiveNumber(canvas.height, 'canvas.height')
  }
  const parsedHitbox = {
    x: requireNonNegativeNumber(hitbox.x, 'hitbox.x'),
    y: requireNonNegativeNumber(hitbox.y, 'hitbox.y'),
    width: requirePositiveNumber(hitbox.width, 'hitbox.width'),
    height: requirePositiveNumber(hitbox.height, 'hitbox.height')
  }

  if (
    parsedHitbox.x + parsedHitbox.width > parsedCanvas.width ||
    parsedHitbox.y + parsedHitbox.height > parsedCanvas.height
  ) {
    throw new PetManifestValidationError('hitbox must fit inside canvas')
  }

  return {
    petId: requireNonEmptyString(manifest.petId, 'petId'),
    displayName: requireNonEmptyString(manifest.displayName, 'displayName'),
    version,
    canvas: parsedCanvas,
    anchor: {
      x: requireNormalizedNumber(anchor.x, 'anchor.x'),
      y: requireNormalizedNumber(anchor.y, 'anchor.y')
    },
    alignment: manifest.alignment,
    hitbox: parsedHitbox,
    animations: parsedAnimations
  }
}

export const resolveAssetPath = (
  manifestUrl: string,
  assetPath: string
): string => {
  if (!isSafeAssetPath(assetPath)) {
    throw new PetManifestValidationError('asset path must be a safe relative path')
  }

  return new URL(assetPath, manifestUrl).toString()
}
