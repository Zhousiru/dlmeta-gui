const fs = require('fs')
const { exec } = require('child_process')
const { dialog, remote } = require('electron')

const setting = require('./setting.cjs')
const util = require('./util.cjs')
const path = require('path')

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

// exports.getFolderList = async (_, target) => {
//     let targetPath = setting.get(target)

//     let list = await fs.promises.readdir(targetPath, { withFileTypes: true })
//     let folder = []
//     list.forEach((file) => {
//         if (file.isDirectory()) folder.push(file.name)
//     })

//     return folder
// }

exports.getRawList = async (_) => {
    let list = await fs.promises.readdir(setting.get('rawPath'), { withFileTypes: true })
    let m = []
    list.forEach((file) => {
        if (file.isDirectory()) m.push({
            id: file.name.split('-')[0], // TODO: use regex
            folder: file.name
        })
    })

    return m
}

exports.getDlmetaDetail = async (_, id) => {
    let folder = await this.getRawFolderById(undefined, id)
    let data
    try {
        data = await fs.promises.readFile(path.resolve(setting.get('rawPath'), folder, '.dlmeta.json'))
    } catch (e) {
        if (e.code == 'ENOENT') return undefined
    }

    return JSON.parse(data.toString())
}

exports.resolvePath = async (_, id, relPath) => {
    let folder = await this.getRawFolderById(undefined, id)
    let folderPath = path.resolve(setting.get('rawPath'), folder)
    return path.resolve(folderPath, relPath)
}

exports.getRawFolderById = async (_, id) => {
    let m = await this.getRawList()
    let folder = ''
    m.some(el => {
        if (el.id == id) {
            folder = el.folder
            return true
        }
    });

    return folder
}

exports.getIdByFolder = async (_, folder) => {
    return folder.split('-')[0]
}

exports.genDetail = async (_, id) => {
    let folder = await this.getRawFolderById(undefined, id)
    let folderPath = path.resolve(setting.get('rawPath'), folder)

    return util.execCli(`gen ${folderPath}`)
}
