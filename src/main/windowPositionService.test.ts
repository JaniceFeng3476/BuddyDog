import { describe, expect, it } from 'vitest'
import {
  calculateDefaultWindowBounds,
  constrainWindowBounds
} from './windowPositionService'

describe('calculateDefaultWindowBounds', () => {
  it('places the pet near the bottom-right of the available work area', () => {
    expect(
      calculateDefaultWindowBounds(
        { x: 0, y: 0, width: 1920, height: 1040 },
        { width: 280, height: 300 },
        24
      )
    ).toEqual({ x: 1616, y: 716, width: 280, height: 300 })
  })

  it('supports displays with negative coordinates', () => {
    expect(
      calculateDefaultWindowBounds(
        { x: -1920, y: 0, width: 1920, height: 1040 },
        { width: 280, height: 300 },
        24
      )
    ).toEqual({ x: -304, y: 716, width: 280, height: 300 })
  })
})

describe('constrainWindowBounds', () => {
  it('keeps a moved window inside the selected display work area', () => {
    expect(
      constrainWindowBounds(
        { x: 1850, y: 1000, width: 280, height: 300 },
        { x: 0, y: 0, width: 1920, height: 1040 }
      )
    ).toEqual({ x: 1640, y: 740, width: 280, height: 300 })
  })

  it('corrects bounds beyond the top-left edge', () => {
    expect(
      constrainWindowBounds(
        { x: -400, y: -200, width: 280, height: 300 },
        { x: 0, y: 0, width: 1920, height: 1040 }
      )
    ).toEqual({ x: 0, y: 0, width: 280, height: 300 })
  })
})
