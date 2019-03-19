const path = require('path')
const { sox, trim } = require('./sox')
const timeWizard = require('./time-wizard')

const mergeTracks = async (tmp, name, meta) => {
  const trimmedFiles = meta.map(({ name }) => path.resolve(tmp, `${name}-cleaned-trimmed-48000.wav`)).join(' ')
  return sox(`-m ${trimmedFiles} ${tmp}/${name}-merged.wav`)
}

const monoNormalize = async (tmp, name) => sox(`${tmp}/${name}-merged.wav ${tmp}/${name}-mono-norm.wav remix 1 norm -3 highpass 10`)

module.exports = async (tmp, name, dataDir, meta) => {
  await mergeTracks(tmp, name, meta)
  await monoNormalize(tmp, name, dataDir)

  // for some reason the soundboard has been cut correctly but nothing end has?
  // need to listen to soundboard pre merge then can sort it all out

  const hasStart = meta.filter(m => 'start' in m)
  let start = 0
  if (hasStart.length > 0) {
    const preSyncStart = hasStart[0].start
    const sync = hasStart[0].sync
    start = timeWizard.diff(preSyncStart, sync)
  }
  await trim(tmp, `${tmp}/${name}-mono-norm.wav`, `${name}-mono-norm-trimmed`, start)
}
