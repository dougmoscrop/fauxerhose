'use strict';

const assert = require('assert');
const stream = require('stream');

const { lambda } = require('aws-streams');
const pump = require('pump-promise');

module.exports = function fauxerhose(options = {}) {
  const Transform = options.transform || stream.PassThrough;
  const Destination = options.destination;

  assert(typeof Destination === 'function', 'fauxerhose: destination must be a function');

  return async event => {
    const records = new lambda.KinesisEvent(event);

    const transform = new Transform();
    const destination = new Destination();

    await pump(records, transform, destination);

    return { transform, destination };
  };
};