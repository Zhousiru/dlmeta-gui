const { contextBridge, ipcRenderer } = require('electron')

let fnObj = Object()
ipcRenderer.invoke('_getFn').then(r => {
    r.forEach(fn => {
        console.log(`[INFO] expose handler: ${fn}`)
        fnObj[fn] = () => ipcRenderer.invoke(fn)
    });

    contextBridge.exposeInMainWorld('electronAPI', fnObj)
})
