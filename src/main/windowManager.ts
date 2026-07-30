import { BrowserWindow } from 'electron'
import { MouseInteractionService } from './mouseInteractionService'
import { WindowPositionService } from './windowPositionService'
import { WindowSizeService } from './windowSizeService'

interface WindowManagerOptions {
  readonly preloadPath: string
  readonly rendererFilePath: string
  readonly rendererUrl?: string
}

export class WindowManager {
  private petWindow: BrowserWindow | undefined
  private mouseInteractionService: MouseInteractionService | undefined

  constructor(
    private readonly options: WindowManagerOptions,
    private readonly windowPositionService = new WindowPositionService(),
    private readonly windowSizeService = new WindowSizeService()
  ) {}

  create(): BrowserWindow {
    if (this.petWindow && !this.petWindow.isDestroyed()) {
      return this.petWindow
    }

    this.windowSizeService.reset()

    const windowBounds = this.windowPositionService.getDefaultBounds()
    const petWindow = new BrowserWindow({
      ...windowBounds,
      acceptFirstMouse: true,
      alwaysOnTop: true,
      backgroundColor: '#00000000',
      frame: false,
      fullscreenable: false,
      hasShadow: false,
      maximizable: false,
      minimizable: false,
      movable: true,
      resizable: false,
      show: false,
      skipTaskbar: true,
      title: 'BuddyDog',
      transparent: true,
      useContentSize: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        preload: this.options.preloadPath,
        sandbox: true
      }
    })

    this.petWindow = petWindow
    this.mouseInteractionService = new MouseInteractionService(
      petWindow,
      this.windowPositionService,
      this.windowSizeService
    )
    this.mouseInteractionService.enable()

    petWindow.setAlwaysOnTop(true, 'floating')

    petWindow.once('ready-to-show', () => {
      if (!petWindow.isDestroyed()) {
        petWindow.show()
      }
    })

    petWindow.once('closed', () => {
      this.mouseInteractionService?.dispose()
      this.mouseInteractionService = undefined
      this.petWindow = undefined
    })

    if (this.options.rendererUrl) {
      void petWindow.loadURL(this.options.rendererUrl)
    } else {
      void petWindow.loadFile(this.options.rendererFilePath)
    }

    return petWindow
  }

  show(): void {
    if (this.petWindow && !this.petWindow.isDestroyed()) {
      this.petWindow.show()
    }
  }

  hide(): void {
    if (this.petWindow && !this.petWindow.isDestroyed()) {
      this.petWindow.hide()
    }
  }

  destroy(): void {
    if (this.petWindow && !this.petWindow.isDestroyed()) {
      this.petWindow.destroy()
    }
  }
}
