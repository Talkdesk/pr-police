const commands = require('./commands')

const isDirectMessage = function isDirectMessage (msg) {
  // slack direct messages channel id start with D
  return msg.type === 'message' && msg.channel.charAt(0) === 'D'
}

const isBotMessage = function isBotMessage (msg) {
  return msg.subtype && msg.subtype === 'bot_message'
}

const isMessage = function isMessage (msg) {
  return msg.type === 'message'
}

// for now all commands execute the same operation
const isBotCommand = function isBotCommand (msg) {
  return commands.some((command) => msg.text === command)
}

module.exports = { isDirectMessage, isBotMessage, isMessage, isBotCommand }
