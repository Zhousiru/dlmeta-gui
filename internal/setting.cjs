const fs = require('fs')

let s

exports.loadSetting = () => {
    console.log(`[INFO] load setting`)

    const settingPath = './setting.json'

    if (!fs.existsSync(settingPath)) {
        fs.writeFileSync(settingPath, '{}', { flag: 'w' })
    }

    let str = fs.readFileSync(settingPath).toString()
    if (!str.trim()) str = '{}'

    s = JSON.parse(str)
}

exports.get = (k) => {
    return s[k]
}
