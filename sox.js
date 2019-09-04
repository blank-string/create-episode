const chalk = require('chalk')
const util = require('util')
let { exec } = require('child_process')
exec = util.promisify(exec)
const timeWizard = require('./time-wizard')

const sox = async (command) => {
  command = `sox ${command}`
  console.log(chalk.green(command))
  const { stdout, stderr } = await exec(command)
  console.log(chalk.blueBright(stdout))
  console.log(chalk.yellow(stderr))
  return { stdout, stderr }
}

const trim = async (tmp, audio, name, start, end = '') => {
  if (end !== '') end = timeWizard.diff(start, end)
  return sox(`${audio} ${tmp}/${name}.flac trim ${start} ${end}`)
}

module.exports = {
  sox,
  trim
}
