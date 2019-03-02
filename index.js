const fs = require('fs-extra')
const path = require('path')
const meta = require('./args')

const tmp = path.resolve(__dirname, 'tmp')
if (fs.existsSync(tmp)) fs.removeSync(tmp)
fs.mkdirSync(tmp)

console.log(meta)
