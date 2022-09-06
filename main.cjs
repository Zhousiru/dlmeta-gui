const { app, BrowserWindow, ipcMain, MenuItem, Menu, shell } = require('electron')
const path = require('path')

const ipc = require('./internal/ipc.cjs')
const setting = require('./internal/setting.cjs')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.setTitle('DLmeta GUI')

    let menu = new Menu
    menu.append(
        new MenuItem({
            label: 'Dev',
            submenu: [{
                label: 'Open DevTools',
                click: function () {
                    win.webContents.openDevTools()
                }
            }]
        })
    )
    menu.append(
        new MenuItem({
            label: 'About',
            submenu: [
                {
                    label: 'GitHub: Zhousiru/dlmeta-gui',
                    click: function () {
                        shell.openExternal('https://github.com/Zhousiru/dlmeta-gui')
                    }
                },
                {
                    label: 'GitHub: Zhousiru/dlmeta',
                    click: function () {
                        shell.openExternal('https://github.com/Zhousiru/dlmeta')
                    }
                }
            ]
        })
    )

    win.setMenu(menu)

    win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    ipcMain.handle('_getFn', () => { return Object.keys(ipc) })

    Object.keys(ipc).forEach(fn => {
        console.log(`[INFO] reg handler: ${fn}`)
        ipcMain.handle(fn, ipc[fn])
    })

    setting.loadSetting()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
