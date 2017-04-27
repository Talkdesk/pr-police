const isDirectMessage = function isDirectMessage (msg) {
  // slack direct messages channel id start with D
  return msg.type === 'message' && msg.channel.charAt(0) === 'D'
}

const isBotMessage = function isBotMessage (msg) {
  return msg.subtype && msg.subtype === 'bot_message'
}

module.exports = { isDirectMessage, isBotMessage }
