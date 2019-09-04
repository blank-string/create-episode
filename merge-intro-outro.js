const path = require('path')
const { sox, trim } = require('./sox')
const length = require('./length')
const timeWizard = require('./time-wizard')

const mergeTracks = async (tmp, name, meta) => {
  const trimmedFiles = meta.map(({ name }) => path.resolve(tmp, `${name}-cleaned-trimmed-48000.flac`)).join(' ')
  return sox(`-m ${trimmedFiles} ${tmp}/${name}-merged.flac`)
}

const monoNormalize = async (tmp, name) => sox(`${tmp}/${name}-merged.flac ${tmp}/${name}-mono-norm.flac remix 1 norm -3 highpass 10`)

const sampleRate = async (input, output) => sox(`${input} -r 48000 -b 24 ${output}`)

module.exports = async (tmp, name, dataDir, meta) => {
  await mergeTracks(tmp, name, meta)
  await monoNormalize(tmp, name)
  const hasStart = meta.filter(m => 'start' in m)
  let start = 0
  if (hasStart.length > 0) {
    const preSyncStart = hasStart[0].start
    const sync = hasStart[0].sync
    start = timeWizard.diff(preSyncStart, sync)
  }
  await trim(tmp, `${tmp}/${name}-mono-norm.flac`, `${name}-mono-norm-trimmed`, start)

  let intro = meta.filter(m => 'intro' in m)[0].intro.file
  intro = path.join(dataDir, `audio/${intro}`)
  await sampleRate(intro, `${tmp}/intro-48000.flac`)
  intro = `${tmp}/intro-48000.flac`
  const introLength = await length(intro)
  await sox(`${tmp}/${name}-mono-norm-trimmed.flac ${tmp}/${name}-mono-norm-trimmed-pad.flac pad ${introLength.time}`)
  await sox(`-m ${intro} ${tmp}/${name}-mono-norm-trimmed-pad.flac ${tmp}/${name}-intro.flac`)

  const paddedIntroLength = await length(`${tmp}/${name}-intro.flac`)
  let outro = meta.filter(m => 'outro' in m)[0].outro.file
  outro = path.join(dataDir, `audio/${outro}`)
  await sox(`${outro} ${tmp}/outro-padded.flac pad ${paddedIntroLength.time}`)
  await sampleRate(`${tmp}/outro-padded.flac`, `${tmp}/outro-48000.flac`)
  await sox(`-m ${tmp}/${name}-intro.flac ${tmp}/outro-48000.flac ${tmp}/${name}-intro-outro.flac`)
  await sox(`${tmp}/${name}-intro-outro.flac ${dataDir}/${name}.mp3 remix 1 norm -3 highpass 10`)
}
