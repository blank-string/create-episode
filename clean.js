const { sox, trim } = require('./sox')

const getNoiseProfile = async (tmp, name) => sox(`${tmp}/noise-${name}.wav -n noiseprof ${tmp}/${name}-noise.prof`)
const removeNoise = async (tmp, audio, name) => sox(`${audio} ${tmp}/${name}-clean.wav noisered ${tmp}/${name}-noise.prof 0.21`)
const sampleRate = async (tmp, audio, name) => sox(`${audio} -r 48000 ${tmp}/${name}-cleaned-trimmed-48000.wav`)

const clean = async (tmp, { name, file, noise, sync }) => {
  if (noise) {
    await trim(tmp, file, `noise-${name}`, noise.start, noise.end)
    await getNoiseProfile(tmp, name)
    await removeNoise(tmp, file, name)
    await trim(tmp, `${tmp}/${name}-clean.wav`, `${name}-clean-trimmed`, sync)
    await sampleRate(tmp, `${tmp}/${name}-clean-trimmed.wav`, name)
  } else {
    await trim(tmp, file, `${name}-clean-trimmed`, sync)
    await sampleRate(tmp, `${tmp}/${name}-clean-trimmed.wav`, name)
  }
}

module.exports = clean
