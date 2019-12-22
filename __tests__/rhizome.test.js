const Rhizome = require('../lib/rhizome_new')

test('The rhizome exists', () => {
  const r = new Rhizome()
})

test('Storing new information in the rhizome creates a thing', () => {
  const r = new Rhizome()
  information = 'fake'
  thing = r.store(information)
  expect(thing.information).toBe(information)
  expect(thing).toHaveProperty('uri')
})

test('Storing in the rhizome has side effects of storing in the continuum and registering in the repertory', () => {
  const fakeContinuum = { store: jest.fn(), retrieve: jest.fn() }
  const fakeRepertory = { register: jest.fn(), seek: jest.fn() }
  const r = new Rhizome(fakeContinuum, fakeRepertory)
  r.store('fake')
  expect(fakeContinuum.store).toHaveBeenCalled()
  expect(fakeRepertory.register).toHaveBeenCalled()
})

test('Attempting to store existing information in the rhizome does not create a new thing', () => {
  const r = new Rhizome()
  thing = r.store('fake')
  identical_thing = r.store(thing.information)
  expect(identical_thing.uri).toBe(thing.uri)
})

test('Information stored in the rhizome makes it retrievable as a thing by a uri', () => {
  const r = new Rhizome()
  thing = r.store('fake')
  expect(thing).toBe(r.retrieve(thing.uri))
})

test('Things stored in the rhizome are seekable by their information', () => {
  const r = new Rhizome()
  thing = r.store('fake')
  expect(thing.uri).toBe(r.seek(thing.information).uri)
})

test('Seeking something not stored in the rhizome returns undefined', () => {
  const r = new Rhizome()
  expect(r.seek('fake')).toBe(undefined)
})

