import { describe, expect, it } from 'vitest'
import {
  isScreenPoint,
  isWindowDragPhase,
  isWindowScaleCommand
} from './windowInteraction'

describe('window interaction IPC validation', () => {
  it('accepts only supported scale commands', () => {
    expect(isWindowScaleCommand('increase')).toBe(true)
    expect(isWindowScaleCommand('reset')).toBe(true)
    expect(isWindowScaleCommand('maximize')).toBe(false)
  })

  it('accepts only supported drag phases', () => {
    expect(isWindowDragPhase('start')).toBe(true)
    expect(isWindowDragPhase('end')).toBe(true)
    expect(isWindowDragPhase('drop')).toBe(false)
  })

  it('accepts only finite numeric screen coordinates', () => {
    expect(isScreenPoint({ x: 120, y: -40 })).toBe(true)
    expect(isScreenPoint({ x: Number.POSITIVE_INFINITY, y: 0 })).toBe(false)
    expect(isScreenPoint({ x: '120', y: 0 })).toBe(false)
  })
})
