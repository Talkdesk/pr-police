const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

test('when passing no arguments calls server function', (assert) => {
  const serverStub = sinon.stub().callsFake(() => null)
  const configStub = {parse: sinon.stub().callsFake(() => ({config: 'value'}))}
  const cli = proxyquire('../lib/cli', { './server': serverStub, './configuration': configStub })

  const exitCode = cli({ _: [] })

  assert.ok(configStub.parse.calledWith(process.env))
  assert.ok(serverStub.calledWith({config: 'value'}))
  assert.equals(exitCode, 0)
  assert.end()
})

test('when the configuration raises an error', (assert) => {
  sinon.stub(console, 'error')

  const error = {
    message: 'Invalid configuration',
    fields: {
      'tokens.github': 'Invalid Github token'
    }
  }

  const serverStub = sinon.stub().callsFake(() => null)
  const configStub = {parse: () => { throw error }}
  const cli = proxyquire('../lib/cli', { './server': serverStub, './configuration': configStub })

  const exitCode = cli({ _: [] })

  assert.ok(console.error.calledOnce)
  assert.equals(exitCode, 1)
  assert.end()
})
