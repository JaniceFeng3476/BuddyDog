import { contextBridge } from 'electron'

const buddyDogApi = Object.freeze({
  versions: Object.freeze({
    electron: process.versions.electron
  })
})

contextBridge.exposeInMainWorld('buddyDog', buddyDogApi)

