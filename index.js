const fs = require('fs-extra')
const path = require('path')
const { name, dataDir, meta, introOutro, keep } = require('./args')
const clean = require('./clean')
const merge = require('./merge')
const mergeIntroOutro = require('./merge-intro-outro')

const tmp = path.resolve(__dirname, 'tmp')

const createTmp = () => {
  if (fs.existsSync(tmp)) fs.removeSync(tmp)
  fs.mkdirSync(tmp)
}

const main = async () => {
  createTmp()

  meta.forEach(({ file }) => {
    if (!fs.existsSync(file)) {
      console.log(`file ${file} does not exist`)
      process.exit(1)
    }
  })

  await Promise.all(meta.map((m) => clean(tmp, m)))
  if (!introOutro) await mergeIntroOutro(tmp, name, dataDir, meta)
  else await merge(tmp, name, dataDir, meta)

  if (!keep) fs.removeSync(tmp)
}

main()
