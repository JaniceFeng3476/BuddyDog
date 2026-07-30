import { describe, expect, it } from 'vitest'
import {
  calculateNextWindowScale,
  calculateScaledWindowBounds,
  MAXIMUM_WINDOW_SCALE,
  MINIMUM_WINDOW_SCALE
} from './windowSizeService'

describe('calculateNextWindowScale', () => {
  it('changes the scale in ten-percent steps', () => {
    expect(calculateNextWindowScale(1, 'increase')).toBe(1.1)
    expect(calculateNextWindowScale(1, 'decrease')).toBe(0.9)
  })

  it('clamps scaling to the supported range', () => {
    expect(calculateNextWindowScale(MAXIMUM_WINDOW_SCALE, 'increase')).toBe(1.6)
    expect(calculateNextWindowScale(MINIMUM_WINDOW_SCALE, 'decrease')).toBe(0.6)
  })

  it('resets to the default scale', () => {
    expect(calculateNextWindowScale(1.6, 'reset')).toBe(1)
  })
})

describe('calculateScaledWindowBounds', () => {
  it('scales both dimensions while preserving the current center', () => {
    expect(
      calculateScaledWindowBounds(
        { x: 500, y: 400, width: 280, height: 300 },
        { x: 0, y: 0, width: 1920, height: 1040 },
        1.2
      )
    ).toEqual({ x: 472, y: 370, width: 336, height: 360 })
  })

  it('keeps a scaled window inside its display work area', () => {
    expect(
      calculateScaledWindowBounds(
        { x: 1616, y: 716, width: 280, height: 300 },
        { x: 0, y: 0, width: 1920, height: 1040 },
        1.6
      )
    ).toEqual({ x: 1472, y: 560, width: 448, height: 480 })
  })

  it('calculates the exact minimum supported window size', () => {
    expect(
      calculateScaledWindowBounds(
        { x: 500, y: 400, width: 280, height: 300 },
        { x: 0, y: 0, width: 1920, height: 1040 },
        0.6
      )
    ).toEqual({ x: 556, y: 460, width: 168, height: 180 })
  })
})
