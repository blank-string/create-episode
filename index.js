const fs = require('fs')
const path = require('path')
const yargs = require('yargs')

const args = yargs
  .option('name', {
    alias: 'n'
  })
  .option('dir', {
    alias: 'd'
  })
  .argv

const dataDir = path.resolve(process.cwd(), args.dir)
const name = args.name
const metaDir = path.join(dataDir, name)

const meta = fs.readdirSync(metaDir)
  .map(filename => path.join(metaDir, filename))
  .filter(filename => filename.includes('.json'))
  .map(filename => require(filename))

console.log(meta)
