const fs = require('fs')

let s

exports.loadSetting = () => {
    console.log(`[INFO] load setting`)
    fs.writeFileSync("./setting.json", '', { flag: 'a' })
    let str = fs.readFileSync("./setting.json").toString()
    s = JSON.parse(str)
}

exports.get = (k) => {
    return s[k]
}
