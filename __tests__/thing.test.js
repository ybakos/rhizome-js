const Thing = require('../lib/thing')

test('A Thing exists', () => {
  const thing = new Thing()
})

test('A Thing has a URI', () => {
  const thing = new Thing()
  expect(thing).toHaveProperty('uri')
})
