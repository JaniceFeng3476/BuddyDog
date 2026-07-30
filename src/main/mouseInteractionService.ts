import type {
  BrowserWindow,
  Event as ElectronEvent,
  Input
} from 'electron'
import { ipcMain, type IpcMainEvent, type Rectangle } from 'electron'
import {
  isScreenPoint,
  isWindowDragPhase,
  isWindowScaleCommand,
  WINDOW_DRAG_CHANNEL,
  WINDOW_SCALE_CHANNEL,
  type ScreenPoint,
  type WindowScaleCommand
} from '../shared/windowInteraction'
import type { WindowPositionService } from './windowPositionService'
import type { WindowSizeService } from './windowSizeService'

const MOVE_SETTLE_DELAY_MS = 150

export class MouseInteractionService {
  private correctionTimer: ReturnType<typeof setTimeout> | undefined
  private dragState:
    | {
        readonly pointer: ScreenPoint
        readonly windowBounds: Rectangle
      }
    | undefined

  private readonly handleKeyboardInput = (
    event: ElectronEvent,
    input: Input
  ): void => {
    const command = this.getKeyboardScaleCommand(input)

    if (!command) {
      return
    }

    event.preventDefault()
    this.windowSizeService.adjust(this.window, command)
  }

  private readonly handleDragRequest = (
    event: IpcMainEvent,
    phase: unknown,
    point: unknown
  ): void => {
    if (
      event.sender.id !== this.window.webContents.id ||
      !isWindowDragPhase(phase) ||
      !isScreenPoint(point)
    ) {
      return
    }

    if (phase === 'start') {
      this.dragState = {
        pointer: point,
        windowBounds: this.window.getBounds()
      }
      return
    }

    if (phase === 'move' && this.dragState) {
      this.window.setPosition(
        Math.round(
          this.dragState.windowBounds.x + point.x - this.dragState.pointer.x
        ),
        Math.round(
          this.dragState.windowBounds.y + point.y - this.dragState.pointer.y
        ),
        false
      )
      return
    }

    if (phase === 'end') {
      this.dragState = undefined
      this.correctWindowBounds()
    }
  }

  private readonly handleScaleRequest = (
    event: IpcMainEvent,
    command: unknown
  ): void => {
    if (
      event.sender.id !== this.window.webContents.id ||
      !isWindowScaleCommand(command)
    ) {
      return
    }

    this.windowSizeService.adjust(this.window, command)
  }

  private readonly scheduleBoundaryCorrection = (): void => {
    if (this.dragState) {
      return
    }

    if (this.correctionTimer) {
      clearTimeout(this.correctionTimer)
    }

    this.correctionTimer = setTimeout(() => {
      this.correctWindowBounds()
    }, MOVE_SETTLE_DELAY_MS)
  }

  constructor(
    private readonly window: BrowserWindow,
    private readonly windowPositionService: WindowPositionService,
    private readonly windowSizeService: WindowSizeService
  ) {}

  enable(): void {
    this.window.on('move', this.scheduleBoundaryCorrection)
    this.window.webContents.on('before-input-event', this.handleKeyboardInput)
    ipcMain.on(WINDOW_DRAG_CHANNEL, this.handleDragRequest)
    ipcMain.on(WINDOW_SCALE_CHANNEL, this.handleScaleRequest)
  }

  dispose(): void {
    this.window.removeListener('move', this.scheduleBoundaryCorrection)
    this.window.webContents.removeListener(
      'before-input-event',
      this.handleKeyboardInput
    )
    ipcMain.removeListener(WINDOW_DRAG_CHANNEL, this.handleDragRequest)
    ipcMain.removeListener(WINDOW_SCALE_CHANNEL, this.handleScaleRequest)
    this.dragState = undefined

    if (this.correctionTimer) {
      clearTimeout(this.correctionTimer)
      this.correctionTimer = undefined
    }
  }

  private getKeyboardScaleCommand(
    input: Input
  ): WindowScaleCommand | undefined {
    if (input.type !== 'keyDown' || !input.control || input.isAutoRepeat) {
      return undefined
    }

    if (
      input.key === '+' ||
      input.key === '=' ||
      input.code === 'NumpadAdd'
    ) {
      return 'increase'
    }

    if (
      input.key === '-' ||
      input.key === '_' ||
      input.code === 'NumpadSubtract'
    ) {
      return 'decrease'
    }

    if (input.key === '0' || input.code === 'Numpad0') {
      return 'reset'
    }

    return undefined
  }

  private correctWindowBounds(): void {
    if (this.window.isDestroyed()) {
      return
    }

    const currentBounds = this.window.getBounds()
    const safeBounds = this.windowPositionService.getSafeBounds(currentBounds)

    if (safeBounds.x !== currentBounds.x || safeBounds.y !== currentBounds.y) {
      this.window.setBounds(safeBounds, false)
    }
  }
}
