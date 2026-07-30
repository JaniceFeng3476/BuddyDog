export const WINDOW_DRAG_CHANNEL = 'window-interaction:drag'
export const WINDOW_SCALE_CHANNEL = 'window-interaction:scale'

export const WINDOW_DRAG_PHASES = ['start', 'move', 'end'] as const
export const WINDOW_SCALE_COMMANDS = [
  'increase',
  'decrease',
  'reset'
] as const

export type WindowDragPhase = (typeof WINDOW_DRAG_PHASES)[number]
export type WindowScaleCommand = (typeof WINDOW_SCALE_COMMANDS)[number]

export interface ScreenPoint {
  readonly x: number
  readonly y: number
}

export const isWindowDragPhase = (value: unknown): value is WindowDragPhase =>
  typeof value === 'string' &&
  WINDOW_DRAG_PHASES.some((phase) => phase === value)

export const isWindowScaleCommand = (
  value: unknown
): value is WindowScaleCommand =>
  typeof value === 'string' &&
  WINDOW_SCALE_COMMANDS.some((command) => command === value)

export const isScreenPoint = (value: unknown): value is ScreenPoint => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const point = value as Record<string, unknown>

  return (
    typeof point.x === 'number' &&
    Number.isFinite(point.x) &&
    typeof point.y === 'number' &&
    Number.isFinite(point.y)
  )
}
