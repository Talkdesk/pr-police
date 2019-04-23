const fs = require('fs')
const path = require('path')
const server = require('./lib/server')
const config = require('./lib/configuration')

const configFilePath = path.join(__dirname, 'projects.json')
const configFile = fs.existsSync(configFilePath) ? configFilePath : null

server(config.parse(process.env, configFile))
