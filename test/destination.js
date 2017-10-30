'use strict';

const test = require('ava');

const fauxerhose = require('../lib/destination');

test('throws when no destination is specified', t => {
  const err = t.throws(() => fauxerhose());
  t.deepEqual(err.message, 'options.destination() must be a function');
});