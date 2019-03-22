const regex = /^\s*([-\d.e]*)\s*([-\d.e]*)\s$/gm

// sox data/e042.mp3 -r 100 e042.dat

const fs = require('fs-extra')
const dat = fs.readFileSync('./e042.dat').toString()
const lines = dat.split('\n')
const data = []
for (const line of lines) {
  const matched = regex.exec(line)
  regex.lastIndex = 0
  if (matched) {
    const time = parseFloat(matched[1], 10)
    const amplitude = parseFloat(matched[2], 10)
    data.push({ time, amplitude })
  }
}
fs.writeFileSync('e042-data.json', JSON.stringify(data))
