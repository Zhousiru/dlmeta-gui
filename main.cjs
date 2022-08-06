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

    ipcMain.handle('readSetting', util.readSetting)
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
