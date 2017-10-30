'use strict';

const stream = require('stream');

const sinon = require('sinon');

const fauxerhose = require('..');

module.exports.encode = function(obj) {
  const str = typeof obj === 'object' ? JSON.stringify(obj) : obj;
  return Buffer.from(str).toString('base64');
};

module.exports.run = function(options) {
  const { Records, transform, writeErr } = options;

  const invalid = [];
  const valid = [];

  const write = sinon.spy(function(record, encoding, callback) {
    valid.push(record);
    callback(writeErr);
  });

  const destination = () => {
    return new stream.Writable({
      objectMode: true,
      write
    }).on('invalid', record => invalid.push(record));
  };

  return fauxerhose({ destination, transform })({ Records })
    .then(() => {
      return { invalid, valid, write };
    });
};