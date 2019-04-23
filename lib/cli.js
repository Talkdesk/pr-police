const server = require('./server')
const meta = require('../package.json')

module.exports = function (args) {
  if (args.help) {
    showUsage()
    return 0
  } else if (args.version) {
    showVersion()
    return 0
  } else if (args._.length > 0) {
    showUsage()
    return 1
  } else {
    server()
    return 0
  }
}

function showUsage () {
  console.log(meta.name + ' [--version] [--help]\n')
  console.log('\t--version  show version info')
  console.log('\t--help     show this usage info')
}

function showVersion () {
  console.log(meta.name + ' version ' + meta.version)
}
