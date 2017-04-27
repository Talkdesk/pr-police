const Slackbot = require('slackbots')
const pullhub = require('pullhub')
const debounce = require('lodash.debounce')

module.exports = function server () {
  const requiredEnvs = ['SLACK_TOKEN', 'GH_TOKEN', 'SLACK_CHANNELS', 'GH_REPOS']

  if (!requiredEnvs.every((k) => !!process.env[k])) {
    throw (
      new Error('Missing one of this required ENV vars: ' + requiredEnvs.join(','))
    )
  }

  const channels = process.env.SLACK_CHANNELS.split(',') || []
  const repos = process.env.GH_REPOS.split(',') || []
  const labels = process.env.GH_LABELS
  const checkInterval = process.env.CHECK_INTERVAL || 3600000 // 1 hour default

  const bot = new Slackbot({
    token: process.env.SLACK_TOKEN,
    name: process.env.SLACK_BOT_NAME || 'PR-Police'
  })

  bot.on('start', () => {
    checkForPRs()
    debounce(checkForPRs, checkInterval)
  })

  function checkForPRs () {
    pullhub(repos, labels)
      .then((prs) => {
        const message = buildMessage(prs)
        return notify(message)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  function buildMessage (data) {
    const message = data.map((item) => {
      return `#${item.number} - ${item.title} | ${item.html_url}`
    })

    return message.join('\n')
  }

  function notify (message) {
    channels.map((channel) => {
      bot.postMessageToChannel(channel, message)
    })
  }
}
