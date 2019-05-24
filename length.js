const chalk = require('chalk')
const util = require('util')
let { exec } = require('child_process')
exec = util.promisify(exec)
const timeWizard = require('./time-wizard')

module.exports = async (file) => {
  const command = `soxi -D ${file}`
  const { stdout, stderr } = await exec(command)
  console.log(chalk.blueBright(stdout))
  console.log(chalk.yellow(stderr))
  return timeWizard.obj(stdout)
}
