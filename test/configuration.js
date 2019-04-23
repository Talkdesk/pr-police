const path = require('path')
const test = require('tape')
const configuration = require('../lib/configuration')

const testDataDir = path.join(path.basename(__dirname), 'data')
const configFile = path.join(testDataDir, 'config.json')
const invalidConfigFile = path.join(testDataDir, 'invalid_config.json')

test('environment configuration', function (tc) {
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

test('file configuration', function (tc) {
  tc.test('non-existing file', function (assert) {
    assert.throws(function () { configuration.parse({}, './non-existing') }, /ConfigurationError/)
    assert.end()
  })

  tc.test('missing tokens', function (assert) {
    assert.throws(function () { configuration.parse({}, configFile) }, /ConfigurationError/)
    assert.end()
  })

  tc.test('invalid configuration file', function (assert) {
    const env = {
      GH_TOKEN: 'github-token',
      SLACK_TOKEN: 'slack-token'
    }

    assert.throws(function () { configuration.parse(env, invalidConfigFile) }, /ConfigurationError/)
    assert.end()
  })

  tc.test('valid configuration file', function (assert) {
    const env = {
      GH_TOKEN: 'github-token',
      SLACK_TOKEN: 'slack-token',
      CHECK_INTERVAL: 5000
    }

    assert.deepEquals(configuration.parse(env, configFile), {
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
        },
        {
          repository: {
            names: ['talkdesk/repo3', 'talkdesk/repo4'],
            labels: ['label3', 'label4']
          },
          slack: {
            channels: ['channel3', 'channel4'],
            groups: ['group3', 'group4'],
            bot: {
              name: 'other_bot_name',
              icon: 'https://images.talkdesk.com/other_bot.png'
            }
          }
        }
      ]
    })
    assert.end()
  })
})
