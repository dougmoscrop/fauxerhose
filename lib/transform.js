'use strict';

const stream = require('stream');

const forward = require('stream-forward');

function defaultTransform(record) {
  const raw = record.toString('utf8');
  try {
    const parsed = JSON.parse(raw);
    this.emit('data', typeof parsed === 'object' ? parsed : { parsed }, 'object');
  } catch (e) {
    this.emit('data', { raw }, 'object');
  }
}

module.exports = function transform(options) {
  const { transform = defaultTransform } = options;

  return forward(new stream.Transform({
    objectMode: true,
    transform: function (record, encoding, callback) {
      Promise.resolve()
        .then(() => {
          return transform.call(this, record, encoding);
        })
        .then(result => callback(null, result))
        .catch(callback);
    }
  }), { events: ['invalid'] } );
};