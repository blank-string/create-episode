const fs = require('fs-extra')
const path = require('path')
const meta = require('./args')
const clean = require('./clean')

const tmp = path.resolve(__dirname, 'tmp')
if (fs.existsSync(tmp)) fs.removeSync(tmp)
fs.mkdirSync(tmp)

meta.slice(0, 1).forEach(async ({ name, file, noise }) => {
  await clean(tmp, { name, file, noise })
})
