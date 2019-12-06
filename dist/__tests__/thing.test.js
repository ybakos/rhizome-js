'use strict';

var Thing = require('../lib/thing');

test('A Thing exists', function () {
  var thing = new Thing();
});

test('A Thing has information', function () {
  var thing = new Thing();
  expect(thing).toHaveProperty('information');
});

test('A Thing has a URI', function () {
  var thing = new Thing();
  expect(thing).toHaveProperty('uri');
});

test('A Thing has a tags', function () {
  var thing = new Thing();
  expect(thing).toHaveProperty('uri');
});

test('Tagging one Thing with another adds their URIs to both their tags lists', function () {
  thing = new Thing('fake', 0, []);
  other = new Thing('other fake', 1, []);
  thing.tag(other);
  expect(thing.tags).toContain(other.uri);
  expect(other.tags).toContain(thing.uri);
});