'use strict';

var Continuum = require('../lib/continuum');

test('The continuum exists', function () {
  var c = new Continuum();
});

test('The continuum represents an infinite set of Things', function () {
  var c = new Continuum([]);
  expect(c).toHaveProperty('things');
});

test('Storing information in the continuum returns a Thing with a URI', function () {
  var c = new Continuum();
  thing = c.store('fake');
  expect(thing.information).toBe('fake');
  expect(thing.uri).toBe(0);
  expect(thing.tags).toEqual([]);
});

test('You retrieve a thing via its uri', function () {
  var c = new Continuum();
  thing = c.store('fake');
  expect(c.retrieve(thing.uri)).toBe(thing);
});