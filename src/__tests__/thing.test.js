const Thing = require('../lib/thing')

test('A Thing exists', () => {
  const thing = new Thing()
})

test('A Thing has information', () => {
  const thing = new Thing()
  expect(thing).toHaveProperty('information')
})

test('A Thing has a URI', () => {
  const thing = new Thing()
  expect(thing).toHaveProperty('uri')
})

test('A Thing has a tags', () => {
  const thing = new Thing()
  expect(thing).toHaveProperty('uri')
})

test('Tagging one Thing with another adds their URIs to both their tags lists', () => {
  thing = new Thing('fake', 0, [])
  other = new Thing('other fake', 1, [])
  thing.tag(other)
  expect(thing.tags).toContain(other.uri)
  expect(other.tags).toContain(thing.uri)
})
