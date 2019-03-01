const chalk = require('chalk')
const util = require('util')
let { exec } = require('child_process')
exec = util.promisify(exec)

module.exports = async (command) => {
  command = `sox ${command}`
  console.log(chalk.green(command))
  const { stdout, stderr } = await exec(command)
  console.log(chalk.blueBright(stdout))
  console.log(chalk.yellow(stderr))
  return { stdout, stderr }
}

// sox $in noise-$name.wav trim $noise_start $noise_end
// sox noise-$name.wav -n noiseprof $name-noise.prof
// sox $in $out noisered $name-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10
// sox $name.wav $name-end.wav trim 0 $end
// sox $name-end.wav $name-clipped.wav trim $clap

// there is a complete clean audio file

// sox -m $merged $name-merged.wav
// sox $name-merged.wav $name-mono.wav remix 1
// sox $name-mono.wav $name-mono-norm.wav norm -3 highpass 10
// sox $name-mono-norm.wav $name-mono-norm-start.wav trim $start
// intro_length=`soxi -D $intro_file`
// sox $name-mono-norm-start.wav $name-mono-norm-start-padded.wav pad $intro_length
// sox -m $intro_file $name-mono-norm-start-padded.wav $name-mono-norm-start-padded-intro.wav
// padded_intro_length=`soxi -D $name-mono-norm-start-padded-intro.wav`
// sox $outro_file $outro-padded.wav pad $padded_intro_length
// sox -m $name-mono-norm-start-padded-intro.wav $outro-padded.wav $name.wav
// sox $name.wav $name.mp3 remix 1 norm -3 highpass 10

// const getNoise = async (audio, name, start, end) => sox(`${audio} noise-${name}.wav trim ${start} ${end - start}`)
// const getNoiseProfile = async (name) => sox(`noise-${name}.wav -n noiseprof ${name}-noise.prof`)
// const removeNoiseAndClean = async (audio, name) => sox(`${audio} ${name}-clean.wav noisered ${name}-noise.prof 0.21 compand 0.1,0.3 -60,-60,-30,-15,-20,-12,-4,-8,-2,-7 -2 norm -3 highpass 10`)
// const trim = async (name, start, end) => sox(`${name}-clean.wav trim ${start} ${end - start}`)

// const clean = async () => {
//   const episode = 'e041'
//   const name = `${episode}-luke`
//   const audio = './data/e041/e041-luke.wav'
//   const noise = {
//     start: '00:24',
//     end: '00:34'
//   }
//   const trim = {
//     start: '00:24',
//     end: '40:45'
//   }

//   await getNoise(audio, name, noise.start, noise.end)
//   await getNoiseProfile(name)
//   await removeNoiseAndClean(audio, name)
//   await trim(name, trim.start, trim.end)
// }
// // main()

// module.exports = {
//   getNoise
// }
