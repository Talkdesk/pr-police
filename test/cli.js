const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

test('when passing no arguments calls server function', (assert) => {
  const serverStub = sinon.stub().callsFake(() => null)
  const cli = proxyquire('../lib/cli', { './server': serverStub })

  const exitCode = cli({ _: [] })

  assert.ok(serverStub.calledWith({config: 'value'}))
  assert.equals(exitCode, 0)
  assert.end()
})
