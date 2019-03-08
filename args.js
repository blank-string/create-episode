const fs = require('fs-extra')
const path = require('path')
const yargs = require('yargs')
const chalk = require('chalk')

const args = yargs
  .option('name', {
    alias: 'n',
    describe: 'The name of the episode, also the name of the sub folder'
  })
  .option('dir', {
    alias: 'd',
    describe: 'the directory where all the data is stored'
  })
  .option('introOutro', {
    alias: 'i',
    describe: 'adds the intro and the outro'
  })
  .help()
  .example(`Folder Structure:
  ./data
  ├── audio
  │   ├── closing.mp3
  │   ├── opening.mp3
  │   ├── sfx-1.mp3
  │   └── sfx-2.mp3
  └── e01
  .   ├── person-1.json
  .   ├── person-1.wav
  .   ├── person-2.json
  .   ├── person-2.mp3
  .   ├── person-3.json
  .   └── person-3.aif

create-episode -d ./data -name e01
`).argv

const error = (message) => {
  console.log(chalk.red(message))
  console.log()
  yargs.showHelp()
  process.exit(1)
}

const name = args.name
const dir = args.dir
const introOutro = args.introOutro
if (typeof name === 'undefined') error('--name -n is requireed')
if (typeof dir === 'undefined') error('--dir -d is requireed')

const dataDir = path.resolve(process.cwd(), dir)
if (!fs.existsSync(dataDir)) error(`${dataDir} does not exist`)

const metaDir = path.join(dataDir, name)
if (!fs.existsSync(metaDir)) error(`${metaDir} does not exist`)

const meta = fs.readdirSync(metaDir)
  .map(filename => path.join(metaDir, filename))
  .filter(filename => filename.includes('.json'))
  .map(filename => require(filename))
  .map(d => {
    d.file = path.join(metaDir, d.file)
    return d
  })

module.exports = {
  name,
  dataDir,
  meta,
  introOutro
}
