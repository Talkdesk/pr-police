const server = require('./server')
const config = require('./configuration')
const meta = require('../package.json')

module.exports = function (args) {
  if (args.help) {
    showUsage()
    return 0
  } else if (args.version) {
    showVersion()
    return 0
  } else if (args._.length > 1) {
    showUsage()
    return 1
  } else {
    try {
      server(config.parse(process.env, args._[0]))
      return 0
    } catch (error) {
      showConfigError(error)
      return 1
    }
  }
}

function showUsage () {
  console.log(meta.name + ' [--version] [--help] [config_file]\n')
  console.log('\t--version   show version info')
  console.log('\t--help      show this usage info')
  console.log('\tconfig_file the path to a config file with the projects definition')
}

function showVersion () {
  console.log(meta.name + ' version ' + meta.version)
}

function showConfigError (error) {
  const fieldErrors = Object.keys(error.fields).map((field) => `\t ${field}: ${error.fields[field]}`)
  console.error([error.message].concat(fieldErrors).join('\n'))
}
