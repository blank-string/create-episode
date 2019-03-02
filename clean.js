const sox = require('./sox')
const timeWizard = require('./time-wizard')

const trimAudio = async (tmp, audio, name, start, end) => sox(`${audio} ${tmp}/${name}.wav trim ${start} ${timeWizard.diff(start, end)}`)
const getNoiseProfile = async (tmp, name) => sox(`${tmp}/noise-${name}.wav -n noiseprof ${tmp}/${name}-noise.prof`)

// this compand made me all tinny
// const removeNoiseAndClean = async (tmp, audio, name) => sox(`${audio} ${tmp}/${name}-clean.wav noisered ${tmp}/${name}-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10`)

const removeNoiseAndClean = async (tmp, audio, name) => sox(`${audio} ${tmp}/${name}-clean.wav noisered ${tmp}/${name}-noise.prof 0.21 norm -3 highpass 10`)

const clean = async (tmp, { name, file, noise }) => {
  await trimAudio(tmp, file, `noise-${name}`, noise.start, noise.end)
  await getNoiseProfile(tmp, name)
  await removeNoiseAndClean(tmp, file, name)
}

module.exports = clean
