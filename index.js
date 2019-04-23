const server = require('./lib/server')
const config = require('./lib/configuration')

server(config.parse(process.env))
