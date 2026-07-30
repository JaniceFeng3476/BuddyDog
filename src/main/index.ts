import { app, BrowserWindow } from 'electron'
import { join } from 'node:path'
import { WindowManager } from './windowManager'

const windowManager = new WindowManager({
  preloadPath: join(__dirname, '../preload/index.cjs'),
  rendererFilePath: join(__dirname, '../renderer/index.html'),
  rendererUrl: process.env.ELECTRON_RENDERER_URL
})

app.whenReady().then(() => {
  windowManager.create()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.create()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
