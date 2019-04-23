const test = require('tape')
const configuration = require('../lib/configuration')

test('configuration parsing', function (tc) {
  tc.test('environment variables parsing', function (assert) {
    const environment = {
      SLACK_TOKEN: 'slack-token',
      SLACK_CHANNELS: 'channel1,channel2',
      SLACK_GROUPS: 'group1,group2',
      SLACK_BOT_NAME: 'bot_name',
      SLACK_BOT_ICON: 'https://images.talkdesk.com/bot.png',
      GH_TOKEN: 'github-token',
      GH_REPOS: 'talkdesk/repo1,talkdesk/repo2',
      GH_LABELS: 'label1,label2',
      CHECK_INTERVAL: '5000'
    }

    assert.deepEquals(configuration.parse(environment), {
      tokens: {
        github: 'github-token',
        slack: 'slack-token'
      },
      polling: {
        interval: 5000
      },
      projects: [
        {
          repository: {
            names: ['talkdesk/repo1', 'talkdesk/repo2'],
            labels: ['label1', 'label2']
          },
          slack: {
            channels: ['channel1', 'channel2'],
            groups: ['group1', 'group2'],
            bot: {
              name: 'bot_name',
              icon: 'https://images.talkdesk.com/bot.png'
            }
          }
        }
      ]
    })

    assert.end()
  })

  tc.test('configuration defaults', function (assert) {
    const environment = {
      SLACK_TOKEN: 'slack-token',
      SLACK_CHANNELS: 'channel1',
      GH_TOKEN: 'github-token',
      GH_REPOS: 'talkdesk/repo1'
    }

    assert.deepEquals(configuration.parse(environment), {
      tokens: {
        github: 'github-token',
        slack: 'slack-token'
      },
      polling: {
        interval: configuration.constants.DEFAULT_POLLING_INTERVAL
      },
      projects: [
        {
          repository: {
            names: ['talkdesk/repo1'],
            labels: []
          },
          slack: {
            channels: ['channel1'],
            groups: [],
            bot: {
              name: configuration.constants.DEFAULT_SLACK_BOT_NAME,
              icon: undefined
            }
          }
        }
      ]
    })

    assert.end()
  })

  tc.test('missing required configuration', function (assert) {
    assert.throws(function () { configuration.parse({}) }, /ConfigurationError/)
    assert.end()
  })
})
