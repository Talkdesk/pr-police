const test = require('tape')
const sinon = require('sinon')
const server = require('../lib/server')

const botMock = {on: sinon.stub().yields(true)}
const pullhubMock = sinon.stub().resolves([{title: 'PR title', html_url: 'http://github.com/talkdesk/project/pull/23'}])
const clock = sinon.useFakeTimers()
const configuration = {
  tokens: {
    github: 'github-token',
    slack: 'slack-token'
  },
  polling: {
    interval: 500
  },
  projects: [
    {
      repository: {
        names: ['repo-1', 'repo-2'],
        labels: ['label-1']
      },
      slack: {
        channels: ['channel-1', 'channel-2'],
        groups: ['group-1'],
        bot: {
          name: 'bot name',
          icon: 'bot icon'
        }
      }
    },
    {
      repository: {
        names: ['repo-3', 'repo-4'],
        labels: ['label-2']
      },
      slack: {
        channels: ['channel-3', 'channel-4'],
        groups: ['group-2'],
        bot: {
          name: 'bot name 2',
          icon: 'bot icon 2'
        }
      }
    }
  ]
}

test('it calls slackbot handlers', (assert) => {
  server(configuration, botMock)

  assert.ok(botMock.on.calledWith('start'))
  assert.ok(botMock.on.calledWith('message'))
  assert.ok(botMock.on.calledWith('error'))
  assert.end()
})

test('it calls pullhub on start', (assert) => {
  server(configuration, botMock, pullhubMock)

  clock.tick(500)

  assert.ok(pullhubMock.calledWith(['repo-1', 'repo-2'], 'label-1'))
  assert.ok(pullhubMock.calledWith(['repo-3', 'repo-4'], 'label-2'))
  assert.end()
})
