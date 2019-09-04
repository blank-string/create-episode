const path = require('path')
const { sox, trim } = require('./sox')
const timeWizard = require('./time-wizard')

const mergeTracks = async (tmp, name, meta) => {
  const trimmedFiles = meta.map(({ name }) => path.resolve(tmp, `${name}-start.flac`)).join(' ')
  return sox(`-m ${trimmedFiles} ${tmp}/${name}-merged.flac`)
}

const monoNormalize = async (tmp, name, dataDir) => sox(`${tmp}/${name}-merged.flac ${dataDir}/${name}.mp3 remix 1 norm -3 highpass 10`)

module.exports = async (tmp, name, dataDir, meta) => {
  const hasStart = meta.filter(m => 'start' in m)
  let start = 0
  if (hasStart.length > 0) {
    const preSyncStart = hasStart[0].start
    const sync = hasStart[0].sync
    start = timeWizard.diff(preSyncStart, sync)
  }
  for (const m of meta) {
    if (m.name !== 'soundboard') await await trim(tmp, `${tmp}/${m.name}-cleaned-trimmed-48000.flac`, `${m.name}-start`, start)
    else await sox(`${tmp}/${m.name}-cleaned-trimmed-48000.flac ${tmp}/${m.name}-start.flac`)
  }
  await mergeTracks(tmp, name, meta)
  await monoNormalize(tmp, name, dataDir)
}
