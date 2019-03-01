const sox = require('./sox')

const fs = require('fs-extra')
const path = require('path')

const timeWizard = require('./time-wizard')

// sox $in noise-$name.wav trim $noise_start $noise_end
// sox noise-$name.wav -n noiseprof $name-noise.prof
// sox $in $out noisered $name-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10
// sox $name.wav $name-end.wav trim 0 $end
// sox $name-end.wav $name-clipped.wav trim $clap

// there is a complete clean audio file

const getNoise = async (audio, name, start, end) => sox(`${audio} noise-${name}.wav trim ${start} ${end - start}`)
const getNoiseProfile = async (name) => sox(`noise-${name}.wav -n noiseprof ${name}-noise.prof`)
const removeNoiseAndClean = async (audio, name) => sox(`${audio} ${name}-clean.wav noisered ${name}-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10`)
const trim = async (name, start, end) => sox(`${name}-clean.wav trim ${start} ${end - start}`)

const clean = async () => {
  const episode = 'e041'
  const name = `${episode}-luke`
  const audio = './data/e041/e041-luke.wav'
  const noise = {
    start: '00:24',
    end: '00:34'
  }
  const trim = {
    start: '00:24',
    end: '40:45'
  }

  await getNoise(audio, name, noise.start, noise.end)
  await getNoiseProfile(name)
  await removeNoiseAndClean(audio, name)
  await trim(name, trim.start, trim.end)
}
// main()

module.exports = {
  getNoise
}
