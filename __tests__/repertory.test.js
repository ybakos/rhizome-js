const Repertory = require('../lib/repertory')

test('The repertory exists', () => {
  const m = new Repertory()
})

test('The repertory represents a searchable catalog of information', () => {
  const m = new Repertory({})
  expect(m).toHaveProperty('index')
})

test('Registering a thing stores its information in the index', () => {
  const m = new Repertory({})
  m.register(fake_thing())
  expect(m.index[fake_thing().information()]).toEqual(fake_thing().uri())
})

test('Seeking the repertory with existing information returns a uri if found', () => {
  const m = new Repertory({'fake': 0})
  expect(m.seek('fake')).toEqual(0)
})

function fake_thing() {
  return { information: function() { return 'fake'} , uri: function() { return 0 } }
}
