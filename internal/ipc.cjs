const fs = require('fs');
const { dialog } = require('electron')

const setting = require('./setting.cjs')

exports.readSetting = async () => {
    await fs.promises.writeFile("./setting.json", '', { flag: 'a' })

    let data;
    data = await fs.promises.readFile("./setting.json")

    return JSON.parse(data.toString())
}

exports.saveSetting = async (...args) => {
    let settingObj = args[1]

    await fs.promises.writeFile("./setting.json", JSON.stringify(settingObj, null, 4), { flag: 'w+' })
    setting.loadSetting()
}

exports.showOpenDialog = async (...args) => {
    let props = args[1]

    return dialog.showOpenDialog({ properties: props })
}

exports.getRawList = async () => {
    let rawPath = setting.get('rawPath')

    let dir = fs.promises.readdir(rawPath)

    return dir
}
