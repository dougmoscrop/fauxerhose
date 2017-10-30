'use strict';

const pump = require('pump-promise');

const source = require('./lib/source');
const transform = require('./lib/transform');
const destination = require('./lib/destination');

module.exports = function fauxerhose(options) {
  return event => pump(
    source(event),
    transform(options),
    destination(options)
  );
};