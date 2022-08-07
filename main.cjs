const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const util = require('./util.cjs')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('./dist/index.html')

    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    ipcMain.handle('_getFn', () => { return Object.keys(util) })

    Object.keys(util).forEach(fn => {
        console.log(`[INFO] reg handler: ${fn}`)
        ipcMain.handle(fn, util[fn])
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
