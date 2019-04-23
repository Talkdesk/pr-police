const Slackbot = require('slackbots')
const pullhub = require('pullhub')
const messages = require('./messages')
const {
  isDirectMessage,
  isBotMessage,
  isMessage,
  isBotCommand
} = require('./helpers')

const buildMessage = (data) => {
  if (!data) {
    return Promise.resolve(messages.GITHUB_ERROR)
  }

  if (data.length < 1) {
    return Promise.resolve(messages.NO_PULL_REQUESTS)
  }

  const headers = [ messages.PR_LIST_HEADER, '\n' ]

  const message = data.map((item) => {
    return `:star: ${item.title} | ${item.html_url}`
  })

  return Promise.resolve(headers.concat(message).join('\n'))
}

const notifyAllChannels = (project, bot, message) => {
  project.slack.channels.map((channel) => {
    bot.postMessageToChannel(channel, message, {
      username: project.slack.bot.name,
      icon_url: project.slack.bot.icon
    })
  })

  project.slack.groups.map((group) => {
    bot.postMessageToGroup(group, message, {
      username: project.slack.bot.name,
      icon_url: project.slack.bot.icon
    })
  })
}

const postMessage = (channel, project, bot, message) => {
  bot.postMessage(channel, message, {
    username: project.slack.bot.name,
    icon_url: project.slack.bot.icon
  })
}

module.exports = function server (config, bot, hub) {
  hub = hub || pullhub
  bot = bot || new Slackbot({token: config.tokens.slack})

  bot.on('start', () => {
    setInterval(() => {
      config.projects.forEach((project) => {
        getPullRequests(project)
          .then(buildMessage)
          .then(notifyAllChannels.bind(buildMessage, project, bot))
      })
    }, config.polling.interval)
  })

  bot.on('message', (data) => {
    if ((isMessage(data) && isBotCommand(data)) ||
      (isDirectMessage(data) && !isBotMessage(data))) {
      config.projects.forEach((project) => {
        getPullRequests(project)
          .then(buildMessage)
          .then(postMessage.bind(postMessage, project, data.channel, bot))
      })
    }
  })

  bot.on('error', (err) => {
    console.error(err)
  })

  function getPullRequests (project) {
    console.log('Checking for pull requests...')

    return hub(project.repository.names, project.repository.labels.join(','))
            .catch((err) => { console.error(err) })
  }
}
