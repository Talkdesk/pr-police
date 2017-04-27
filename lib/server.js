const Slackbot = require('slackbots')
const pullhub = require('pullhub')
const debounce = require('lodash.debounce')

module.exports = function server () {
  const env = process.env
  const requiredEnvs = ['SLACK_TOKEN', 'GH_TOKEN', 'GH_REPOS']

  if (!requiredEnvs.every((k) => !!env[k])) {
    throw (
      new Error('Missing one of this required ENV vars: ' + requiredEnvs.join(','))
    )
  }

  const channels = env.SLACK_CHANNELS ? env.SLACK_CHANNELS.split(',') : []
  const groups = env.SLACK_GROUPS ? env.SLACK_GROUPS.split(',') : []
  const repos = env.GH_REPOS ? env.GH_REPOS.split(',') : []
  const labels = env.GH_LABELS
  const checkInterval = env.CHECK_INTERVAL || 3600000 // 1 hour default

  const bot = new Slackbot({
    token: env.SLACK_TOKEN,
    name: env.SLACK_BOT_NAME || 'PR-Police'
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

    groups.map((group) => {
      bot.postMessageToGroup(group, message)
    })
  }
}
