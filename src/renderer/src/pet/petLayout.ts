import type { PetCanvasSize, PetHitbox, PetPoint } from './PetManifest'

export interface PetLayout {
  readonly position: PetPoint
  readonly scale: number
  readonly hitArea: PetHitbox
}

export const calculatePetLayout = (
  viewport: PetCanvasSize,
  canvas: PetCanvasSize,
  anchor: PetPoint,
  hitbox: PetHitbox,
  padding = 12
): PetLayout => {
  const availableWidth = Math.max(0, viewport.width - padding * 2)
  const availableHeight = Math.max(0, viewport.height - padding * 2)
  const scale = Math.min(
    availableWidth / canvas.width,
    availableHeight / canvas.height
  )
  const position = {
    x: viewport.width / 2,
    y: viewport.height - padding
  }
  const textureLeft = position.x - canvas.width * anchor.x * scale
  const textureTop = position.y - canvas.height * anchor.y * scale

  return {
    position,
    scale,
    hitArea: {
      x: textureLeft + hitbox.x * scale,
      y: textureTop + hitbox.y * scale,
      width: hitbox.width * scale,
      height: hitbox.height * scale
    }
  }
}
