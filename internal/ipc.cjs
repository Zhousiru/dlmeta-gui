const fs = require('fs')
const { dialog, remote } = require('electron')

const setting = require('./setting.cjs')
const util = require('./util.cjs')
const path = require('path')

exports.readSetting = async () => {
    await fs.promises.writeFile("./setting.json", '', { flag: 'a' })

    let data
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
    let data
    try {
        data = await fs.promises.readFile(await this.resolvePath(undefined, id, '.dlmeta.json'))
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
    })

    return folder
}

exports.getIdByFolder = async (_, folder) => {
    return folder.split('-')[0] // TODO: use regex
}

exports.genDetail = async (_, id) => {
    let folder = await this.getRawFolderById(undefined, id)
    let folderPath = path.resolve(setting.get('rawPath'), folder)

    return util.execCli(`gen --path="${folderPath}"`)
}

exports.saveDetail = async (_, id, newDetail) => {
    let dlmetaPath = await this.resolvePath(undefined, id, '.dlmeta.json')
    return fs.promises.writeFile(dlmetaPath, JSON.stringify(newDetail, null, 4), { flag: 'w+' })
}

exports.convert = async (_, id) => {
    let folder = await this.getRawFolderById(undefined, id)
    let folderPath = path.resolve(setting.get('rawPath'), folder) // await this.resolvePath(undefined, id, '')

    return await util.execCli(`conv --path="${folderPath}" --target="mp3" --copy=True --output="${setting.get('outputPath')}"`)
}

exports.rebuild = async (_, id) => {
    let detail = await this.getDlmetaDetail(_, id)
    let outputPath = path.resolve(setting.get('outputPath'), detail.title)
    let dlmetaPath = await this.resolvePath(undefined, id, '.dlmeta.json')

    fs.unlinkSync(dlmetaPath)
    fs.rmSync(outputPath, { recursive: true, force: true });
}
