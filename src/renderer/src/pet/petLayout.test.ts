import { describe, expect, it } from 'vitest'
import { calculatePetLayout } from './petLayout'

const canvas = { width: 512, height: 512 }
const anchor = { x: 0.5, y: 1 }
const hitbox = { x: 116, y: 116, width: 280, height: 344 }

describe('calculatePetLayout', () => {
  it('fits and centers the full pet canvas in the default window', () => {
    expect(
      calculatePetLayout(
        { width: 280, height: 300 },
        canvas,
        anchor,
        hitbox
      )
    ).toEqual({
      position: { x: 140, y: 288 },
      scale: 0.5,
      hitArea: { x: 70, y: 90, width: 140, height: 172 }
    })
  })

  it('scales proportionally with a resized window', () => {
    const defaultLayout = calculatePetLayout(
      { width: 280, height: 300 },
      canvas,
      anchor,
      hitbox
    )
    const largeLayout = calculatePetLayout(
      { width: 448, height: 480 },
      canvas,
      anchor,
      hitbox
    )

    expect(largeLayout.scale).toBe(0.828125)
    expect(largeLayout.scale).toBeGreaterThan(defaultLayout.scale)
    expect(largeLayout.hitArea.width / largeLayout.hitArea.height).toBeCloseTo(
      hitbox.width / hitbox.height
    )
  })
})
