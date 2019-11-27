const Continuum = require('../lib/continuum')
test('The continuum exists', () => {
  const c = new Continuum()
})

test('The continuum represents an infinite set of Things', () => {
  const c = new Continuum([])
})

test('Storing information in the continuum returns a Thing with a URI', () => {
  const c = new Continuum()
  thing = c.store('fake')
  expect(thing.information).toBe('fake')
  expect(thing.uri).toBe(0)
  expect(thing.tags).toEqual([])
})

test('You retrieve a thing via its uri', () => {
  const c = new Continuum()
  thing = c.store('fake')
  expect(c.get(thing.uri)).toBe(thing)
})
