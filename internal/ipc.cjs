const fs = require('fs');
const { dialog } = require('electron')

const setting = require('./setting.cjs');
const path = require('path');

exports.readSetting = async () => {
    await fs.promises.writeFile("./setting.json", '', { flag: 'a' })

    let data;
    data = await fs.promises.readFile("./setting.json")

    return JSON.parse(data.toString())
}

exports.saveSetting = async (_, settingObj) => {
    await fs.promises.writeFile("./setting.json", JSON.stringify(settingObj, null, 4), { flag: 'w+' })
    setting.loadSetting()
}

exports.showOpenDialog = async (_, props) => {
    return dialog.showOpenDialog({ properties: props })
}

exports.getFolderList = async (_, target) => {
    let targetPath = setting.get(target)

    let list = await fs.promises.readdir(targetPath, { withFileTypes: true })
    let folder = []
    list.forEach((file) => {
        if (file.isDirectory()) folder.push(file.name)
    })

    return folder
}

exports.getDlmetaDetail = async (_, folder) => {
    let data
    try {
        data = await fs.promises.readFile(path.join(setting.get('rawPath'), folder, '.dlmeta.json'))
    } catch (e) {
        if (e.code == 'ENOENT') return undefined
    }

    return JSON.parse(data.toString())
}
