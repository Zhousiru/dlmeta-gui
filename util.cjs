const fs = require('fs');

exports.readSetting = async () => {
    await fs.promises.writeFile("./setting.json", '', { flag: 'a' })

    let data;
    data = await fs.promises.readFile("./setting.json")

    return JSON.parse(data.toString())
}

exports.saveSetting = async (...args) => {
    settingObj = args[1]

    await fs.promises.writeFile("./setting.json", JSON.stringify(settingObj, null, 4), { flag: 'w+' })
    return 0
}
