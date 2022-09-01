const { exec } = require('child_process')
const setting = require('./setting.cjs')

exports.execCli = (param) => {
    let cmd = `python "${setting.get('cliPath')}" ${param}`

    return new Promise(resolve => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                console.error(`[ERR] ${err}`);
            }
            resolve({
                stdout: stdout,
                stderr: stderr
            });
        });
    });
}