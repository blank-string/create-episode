const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const episode = require('./episode.json')
const podcasters = episode.podcasters.map(name => JSON.parse(fs.readFileSync(path.resolve(__dirname, name + '.json')).toString()))
let start = '0'
podcasters.forEach(podcaster => {
  if (podcaster.start) start = parseFloat(podcaster.start) - parseFloat(podcaster.clap)
})
const intro = path.resolve(__dirname, episode.intro)
const outro = path.resolve(__dirname, episode.outro)

const clean = () => fs.readdirSync(__dirname).forEach(file => {
  if (file.endsWith('.wav') || file.endsWith('.prof')) fs.unlinkSync(path.resolve(__dirname, file))
})

const convert = ({ name, noise, clap, end }) => new Promise((resolve, reject) => {
  child_process.execFile('./convert.sh', [`${episode.name}-${name}`, noise.start, noise.end, clap, end], (err, stdout, stderr) => {
    if (err) console.log('err', err)
    if (stderr) console.log('stderr', stderr)
    console.log(stdout)
    resolve()
  })
})

const merge = () => new Promise((resolve, reject) => {
  const mergeName = episode.podcasters.reduce((current, name) => `${current} ${episode.name}-${name}-clipped.wav`, '')
  child_process.execFile('./merge.sh', [episode.name, mergeName, start, intro, outro, intro.split('.')[0], outro.split('.')[0]], (err, stdout, stderr) => {
    if (err) console.log('err', err)
    if (stderr) console.log('stderr', stderr)
    console.log(stdout)
    resolve()
  })
})

const run = () => {
  Promise.all(podcasters.map(convert))
    .then(merge)
    .then(() => {
      clean()
      console.log('done')
    })
}

clean()
run()
