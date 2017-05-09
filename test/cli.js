const test = require('tape')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

test('when passing no arguments calls server function', (t) => {
  t.plan(1)

  const serverStub = sinon.stub().callsFake(() => null)
  const cli = proxyquire('../lib/cli', { './server': serverStub })

  cli({ _: [] })

  t.ok(serverStub.called)
})
