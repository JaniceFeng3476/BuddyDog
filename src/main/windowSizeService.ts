import { screen, type BrowserWindow, type Rectangle } from 'electron'
import type { WindowScaleCommand } from '../shared/windowInteraction'
import {
  constrainWindowBounds,
  PET_WINDOW_SIZE
} from './windowPositionService'

export const DEFAULT_WINDOW_SCALE = 1
export const MINIMUM_WINDOW_SCALE = 0.6
export const MAXIMUM_WINDOW_SCALE = 1.6
export const WINDOW_SCALE_STEP = 0.1

const SCALE_PRECISION = 10

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum)

export const calculateNextWindowScale = (
  currentScale: number,
  command: WindowScaleCommand
): number => {
  if (command === 'reset') {
    return DEFAULT_WINDOW_SCALE
  }

  const currentStep = Math.round(currentScale * SCALE_PRECISION)
  const stepDelta =
    (command === 'increase' ? 1 : -1) *
    Math.round(WINDOW_SCALE_STEP * SCALE_PRECISION)
  const minimumStep = Math.round(MINIMUM_WINDOW_SCALE * SCALE_PRECISION)
  const maximumStep = Math.round(MAXIMUM_WINDOW_SCALE * SCALE_PRECISION)

  return (
    clamp(currentStep + stepDelta, minimumStep, maximumStep) / SCALE_PRECISION
  )
}

export const calculateScaledWindowBounds = (
  currentBounds: Rectangle,
  workArea: Rectangle,
  scale: number
): Rectangle => {
  const width = Math.round(PET_WINDOW_SIZE.width * scale)
  const height = Math.round(PET_WINDOW_SIZE.height * scale)
  const centerX = currentBounds.x + currentBounds.width / 2
  const centerY = currentBounds.y + currentBounds.height / 2
  const centeredBounds: Rectangle = {
    x: Math.round(centerX - width / 2),
    y: Math.round(centerY - height / 2),
    width,
    height
  }

  return constrainWindowBounds(centeredBounds, workArea)
}

export class WindowSizeService {
  private currentScale = DEFAULT_WINDOW_SCALE

  adjust(window: BrowserWindow, command: WindowScaleCommand): number {
    const nextScale = calculateNextWindowScale(this.currentScale, command)
    const currentBounds = window.getBounds()
    const workArea = screen.getDisplayMatching(currentBounds).workArea
    const nextBounds = calculateScaledWindowBounds(
      currentBounds,
      workArea,
      nextScale
    )

    window.setBounds(nextBounds, false)
    this.currentScale = nextScale

    return nextScale
  }

  reset(): void {
    this.currentScale = DEFAULT_WINDOW_SCALE
  }
}
