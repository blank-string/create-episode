const path = require('path')
const fs = require('fs-extra')
const sox = require('./sox')
const timeWizard = require('./time-wizard')

// want this to not just save locally but to a tmp folder, which can then be clean

const trimAudio = async (audio, name, start, end) => sox(`${audio} ${name}.wav trim ${start} ${timeWizard.diff(start, end)}`)

const getNoiseProfile = async (name) => sox(`noise-${name}.wav -n noiseprof ${name}-noise.prof`)
const removeNoiseAndClean = async (audio, name) => sox(`${audio} ${name}-clean.wav noisered ${name}-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10`)

const clean = async () => {
  const episode = 'e041'
  const name = `${episode}-luke`
  const audio = './data/e041/e041-luke.wav'
  const noise = {
    start: 24,
    end: 34
  }
  //   const trim = {
  //     start: 24,
  //     end: '40:47'
  //   }

  await trimAudio(audio, `noise-${name}`, noise.start, noise.end)
  await getNoiseProfile(name)
  await removeNoiseAndClean(audio, name)
//   await trimAudio(`${name}-clean.wav`, `${name}-clean-clipped`, trim.start, trim.end)
}
clean()

module.exports = clean
