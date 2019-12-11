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
  expect(thing).toHaveProperty('tags')
})

test('A Thing has targets', () => {
  const thing = new Thing()
  expect(thing).toHaveProperty('targets')
})

test("Tagging Thing A with Thing B adds B's uri to A's tag list, and A's uri to B's targets list", () => {
  a = new Thing('A', 0, [])
  b = new Thing('B', 1, [])
  a.tag_with(b)
  expect(a.tags).toContain(b.uri)
  expect(b.targets).toContain(a.uri)
})

test("Telling Thing A to tag Thing B adds A's uri to B's tags list, and B's uri to A's targets list", () => {
  a = new Thing('A', 0, [])
  b = new Thing('B', 1, [])
  a.tag(b)
  expect(b.tags).toContain(a.uri)
  expect(a.targets).toContain(b.uri)
})

