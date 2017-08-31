const Slackbot = require('slackbots')
const pullhub = require('pullhub')
const moment = require('moment')
const messages = require('./messages')
const {
  isDirectMessage,
  isBotMessage,
  isMessage,
  isBotCommand
} = require('./helpers')

module.exports = function server () {
  const env = process.env
  const requiredEnvs = ['SLACK_TOKEN', 'GH_TOKEN', 'GH_REPOS']

  if (!requiredEnvs.every((k) => !!env[k])) {
    throw (
      new Error('Missing one of this required ENV vars: ' + requiredEnvs.join(','))
    )
  }
  const channels = env.SLACK_CHANNELS ? env.SLACK_CHANNELS.split(',') : []
  const daysToRun = env.DAYS_TO_RUN || 'Monday,Tuesday,Wednesday,Thursday,Friday'
  const timesToRun = env.TIMES_TO_RUN ? env.TIMES_TO_RUN.split(',') : [900]
  const DEBUG = env.DEBUG || false
  const groups = env.SLACK_GROUPS ? env.SLACK_GROUPS.split(',') : []
  const repos = env.GH_REPOS ? env.GH_REPOS.split(',') : []
  const excludeLabels = env.GH_EXCLUDE_LABELS ? env.GH_EXCLUDE_LABELS.split(',') : []
  const labels = env.GH_LABELS
  const checkInterval = 60000 // Run every minute (60000)
  const botParams = { icon_url: env.SLACK_BOT_ICON }

  const bot = new Slackbot({
    token: env.SLACK_TOKEN,
    name: env.SLACK_BOT_NAME || 'Pr. Police'
  })

  bot.on('start', () => {
    setInterval(() => {
      const now = moment()
      // Check to see if current day and time are the correct time to run
      if (daysToRun.toLowerCase().indexOf(now.format('dddd').toLowerCase()) !== -1) {
        for (var i = timesToRun.length; i--;) {
          if (parseInt(timesToRun[i]) === parseInt(now.format('kmm'))) {
            console.log(now.format('dddd YYYY-DD-MM h:mm a'))

            getPullRequests()
              .then(buildMessage)
              .then(notifyAllChannels)
            return
          } else {
            if (i === 0) {
              DEBUG && console.log(now.format('kmm'), 'does not match any TIMES_TO_RUN (' + timesToRun + ')')
            }
          }
        }
      } else {
        DEBUG && console.log(now.format('dddd'), 'is not listed in DAYS_TO_RUN (' + daysToRun + ')')
      }
    }, checkInterval)
  })

  bot.on('message', (data) => {
    if ((isMessage(data) && isBotCommand(data)) ||
      (isDirectMessage(data) && !isBotMessage(data))) {
      getPullRequests()
        .then(buildMessage)
        .then((message) => {
          bot.postMessage(data.channel, message, botParams)
        })
    }
  })

  bot.on('error', (err) => {
    console.error(err)
  })

  function getPullRequests () {
    console.log('Checking for pull requests...')

    return pullhub(repos, labels).catch((err) => { console.error(err) })
  }

  function buildMessage (data) {
    if (!data) {
      return Promise.resolve(messages.GITHUB_ERROR)
    }

    if (data.length < 1) {
      return Promise.resolve(messages.NO_PULL_REQUESTS)
    }

    const headers = [ messages.PR_LIST_HEADER, '\n' ]
    let message = []

    // Check to see if each PR has any labels from the excluded list
    for (var i = data.length; i--;) {
      if (excludeLabels.length) {
        let foundExcludeLabel = false
        for (var j = data[i].labels.length; j--;) {
          for (var k = excludeLabels.length; k--;) {
            if (data[i].labels[j].name === excludeLabels[k]) {
              DEBUG && console.log('exclude label match:', excludeLabels[k], ' for: ', data[i].title)
              foundExcludeLabel = true
              break
            }
          }
          if (foundExcludeLabel) {
            break
          }
        }
        if (!foundExcludeLabel) {
          message.push(`:star: ${data[i].title} | ${data[i].html_url}`)
        }
      } else {
        message.push(`:star: ${data[i].title} | ${data[i].html_url}`)
      }
    }

    if (message.length) {
      return Promise.resolve(headers.concat(message).join('\n'))
    }
  }

  function notifyAllChannels (message) {
    channels.map((channel) => {
      bot.postMessageToChannel(channel, message, botParams)
    })

    groups.map((group) => {
      bot.postMessageToGroup(group, message, botParams)
    })
  }
}
