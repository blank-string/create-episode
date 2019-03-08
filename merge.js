const path = require('path')
const { sox } = require('./sox')

const mergeTracks = async (tmp, name, meta) => {
  const trimmedFiles = meta.map(({ name }) => path.resolve(tmp, `${name}-cleaned-trimmed-48000.wav`)).join(' ')
  return sox(`-m ${trimmedFiles} ${tmp}/${name}-merged.wav`)
}

const monoNormalize = async (tmp, name) => sox(`${tmp}/${name}-merged.wav ${tmp}/${name}-mono-norm.wav remix 1 norm -3 highpass 10`)

module.exports = async (tmp, name, dataDir, meta) => {
  await mergeTracks(tmp, name, meta)
  await monoNormalize(tmp, name)
}
