import { contextBridge, ipcRenderer } from 'electron'
import {
  WINDOW_DRAG_CHANNEL,
  WINDOW_SCALE_CHANNEL,
  type ScreenPoint,
  type WindowDragPhase,
  type WindowScaleCommand
} from '../shared/windowInteraction'

const buddyDogApi = {
  windowDrag: {
    update: (phase: WindowDragPhase, point: ScreenPoint): void => {
      ipcRenderer.send(WINDOW_DRAG_CHANNEL, phase, point)
    }
  },
  windowScale: {
    adjust: (command: WindowScaleCommand): void => {
      ipcRenderer.send(WINDOW_SCALE_CHANNEL, command)
    }
  },
  versions: {
    electron: process.versions.electron
  }
} as const

contextBridge.exposeInMainWorld('buddyDog', buddyDogApi)
