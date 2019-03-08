const fs = require('fs-extra')
const path = require('path')
const { name, dataDir, meta, introOutro } = require('./args')
const clean = require('./clean')
const merge = require('./merge')
const mergeIntroOutro = require('./merge-intro-outro')

const createTmp = () => {
  const tmp = path.resolve(__dirname, 'tmp')
  if (fs.existsSync(tmp)) fs.removeSync(tmp)
  fs.mkdirSync(tmp)
  return tmp
}

const main = async () => {
  const tmp = createTmp()
  await Promise.all(meta.map(({ name, file, noise, sync }) => clean(tmp, { name, file, noise, sync })))
  if (introOutro) await mergeIntroOutro(tmp, name, dataDir, meta)
  else await merge(tmp, name, dataDir, meta)
  fs.removeSync(tmp)
}

main()
