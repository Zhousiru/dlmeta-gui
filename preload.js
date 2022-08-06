const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    readSetting: () => ipcRenderer.invoke('readSetting')
})
