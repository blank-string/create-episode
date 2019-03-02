const sox = require('./sox')
const timeWizard = require('./time-wizard')

const trimAudio = async (tmp, audio, name, start, end) => sox(`${audio} ${tmp}/${name}.wav trim ${start} ${timeWizard.diff(start, end)}`)
const getNoiseProfile = async (tmp, name) => sox(`noise-${name}.wav -n noiseprof ${tmp}/${name}-noise.prof`)
const removeNoiseAndClean = async (tmp, audio, name) => sox(`${audio} ${tmp}/${name}-clean.wav noisered ${tmp}/${name}-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10`)

const clean = async (tmp, { name, audio, noise }) => {
  // const episode = 'e041'
  // const name = `${episode}-luke`
  // const audio = './data/e041/e041-luke.wav'
  // const noise = {
  //   start: 24,
  //   end: 34
  // }

  await trimAudio(audio, `noise-${name}`, noise.start, noise.end)
  await getNoiseProfile(name)
  await removeNoiseAndClean(audio, name)
}
clean()

module.exports = clean
