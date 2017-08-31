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
  GH_REPOS: 'foo',
  CHECK_INTERVAL: '1'
}

const pullhubMock = sinon.stub().resolves([])
const clock = sinon.useFakeTimers()

const server = proxyquire('../lib/server', {
  slackbots: SlackbotsMock,
  pullhub: pullhubMock
})

test('it throws error on missing required env var', (t) => {
  t.plan(1)

  t.throws(server, Error)
})

test('it calls slackbots onStart handler', (t) => {
  t.plan(1)

  process.env = envMock

  server()
  clock.tick(envMock.CHECK_INTERVAL)
  t.ok(SlackbotsMock.prototype.on.calledWith('start'))
})

// DISABLED, SINCE CHECKING IS NOW GATED BY DAYS AND TIMES
// test('it calls pullhub on start', (t) => {
//   t.plan(1)

//   process.env = envMock

//   server()
//   clock.tick(envMock.CHECK_INTERVAL)
//   t.ok(pullhubMock.called)
// })
