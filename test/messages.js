const test = require('tape')
const messages = require('../lib/messages')

test('it exports an object', (t) => {
  t.plan(1)

  t.equals(typeof messages, 'object')
})
