'use strict';

// Rhizome core library export

var Rhizome = require('./lib/rhizome');
var runningRhizome = require('./bin/invoke');

module.exports = { Rhizome: Rhizome, runningRhizome: runningRhizome };