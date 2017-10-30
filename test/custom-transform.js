'use strict';

const test = require('ava');

const helpers = require('./_helpers');

test('rejects when transform rejects', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('data') } }, ],
    transform: () => Promise.reject(new Error('test'))
  })
    .then(() => {
      t.fail();
    })
    .catch(e => {
      t.deepEqual(e.message, 'test');
    });
});

test('catches events when transform emits invalid', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('data') } }, ],
    transform: function() {
      this.emit('invalid', 'test');
    }
  })
    .then(({ valid, invalid }) => {
      t.deepEqual(valid, []);
      t.deepEqual(invalid ['test']);
    });
});

test('catches events when transform emits valid', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('data') } }, ],
    transform: function() {
      this.emit('data', 'test');
    }
  })
    .then(({ invalid, valid }) => {
      t.deepEqual(invalid, []);
      t.deepEqual(valid, ['test']);
    });
});

test('can produce result by resolving a value', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('data') } }, ],
    transform: function() {
      return Promise.resolve('test');
    }
  })
    .then(({ invalid, valid }) => {
      t.deepEqual(invalid, []);
      t.deepEqual(valid, ['test']);
    });
});

test('can produce multiple records from a single', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('data') } }, ],
    transform: function() {
      this.emit('invalid', 'a');
      this.emit('data', 'b');
      this.emit('invalid', 'c');
      this.emit('data', 'd');
    }
  })
    .then(({ invalid, valid }) => {
      t.deepEqual(invalid, ['a', 'c']);
      t.deepEqual(valid, ['b', 'd']);
    });
});