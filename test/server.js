const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const SlackbotsMock = function SlackbotsMock () {}
SlackbotsMock.prototype.on = sinon.stub()
SlackbotsMock.prototype.on.withArgs('start').yields(true)

const envMock = {
  SLACK_TOKEN: 'foo',
  GH_TOKEN: 'foo',
  SLACK_CHANNELS: 'foo',
  GH_REPOS: 'foo'
}

const debounceMock = sinon.stub()
const pullhubMock = sinon.stub().resolves([])

const server = proxyquire('../lib/server', {
  slackbots: SlackbotsMock,
  pullhub: pullhubMock,
  'lodash.debounce': debounceMock
})

test('it throws error on missing required env var', (t) => {
  t.plan(1)

  t.throws(server, Error)
})

test('it calls slackbots onStart handler', (t) => {
  t.plan(1)

  process.env = envMock

  server()
  t.ok(SlackbotsMock.prototype.on.calledWith('start'))
})

test('it calls pullhub on start', (t) => {
  t.plan(1)

  process.env = envMock

  server()
  t.ok(pullhubMock.calledWith(['foo']))
})

test('it calls lodash debounce on start', (t) => {
  t.plan(1)

  process.env = envMock

  server()
  t.ok(debounceMock.called)
})
