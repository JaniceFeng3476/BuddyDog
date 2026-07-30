import { screen, type Rectangle } from 'electron'

export interface WindowSize {
  readonly width: number
  readonly height: number
}

export const PET_WINDOW_SIZE: WindowSize = {
  width: 280,
  height: 300
}

export const WINDOW_EDGE_MARGIN = 24

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum)

export const calculateDefaultWindowBounds = (
  workArea: Rectangle,
  windowSize: WindowSize = PET_WINDOW_SIZE,
  margin = WINDOW_EDGE_MARGIN
): Rectangle => ({
  x: Math.max(workArea.x, workArea.x + workArea.width - windowSize.width - margin),
  y: Math.max(workArea.y, workArea.y + workArea.height - windowSize.height - margin),
  width: windowSize.width,
  height: windowSize.height
})

export const constrainWindowBounds = (
  bounds: Rectangle,
  workArea: Rectangle
): Rectangle => {
  const maximumX = Math.max(workArea.x, workArea.x + workArea.width - bounds.width)
  const maximumY = Math.max(workArea.y, workArea.y + workArea.height - bounds.height)

  return {
    ...bounds,
    x: clamp(bounds.x, workArea.x, maximumX),
    y: clamp(bounds.y, workArea.y, maximumY)
  }
}

export class WindowPositionService {
  getDefaultBounds(): Rectangle {
    return calculateDefaultWindowBounds(screen.getPrimaryDisplay().workArea)
  }

  getSafeBounds(bounds: Rectangle): Rectangle {
    const workArea = screen.getDisplayMatching(bounds).workArea
    return constrainWindowBounds(bounds, workArea)
  }
}
