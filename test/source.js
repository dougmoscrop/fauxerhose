'use strict';

const stream = require('stream');

const pump = require('pump-promise');
const test = require('ava');
const sinon = require('sinon');

const source = require('../lib/source');

test.beforeEach(t => {
  t.context.data = sinon.spy(function(record, encoding, callback) {
    callback();
  });
  t.context.dest = new stream.Writable({
    write: t.context.data
  });
});

test('does nothing with undefined records', t => {
  return pump(
    source({}),
    t.context.dest
  )
    .then(() => {
      t.false(t.context.data.called);
    });
});

test('does nothing with no records', t => {
  return pump(
    source({
      Records: []
    }),
    t.context.dest
  )
    .then(() => {
      t.false(t.context.data.called);
    });
});

test('catches invalid records', t => {
  const invalid = sinon.stub();
  return pump(
    source({
      Records: [{}, { kinesis: { data: {} } }]
    }),
    t.context.dest.on('invalid', invalid)
  )
    .then(() => {
      t.false(t.context.data.called);
      t.true(invalid.calledTwice);
    });
});

test('passes kinesis records through', t => {
  return pump(
    source({
      Records: [{ kinesis: { data: Buffer.from('a').toString('base64') } }, { kinesis: { data: Buffer.from('b').toString('base64')  } }]
    }),
    t.context.dest
  )
    .then(() => {
      const { data } = t.context;

      t.true(data.calledTwice);
      t.deepEqual(data.firstCall.args[0].toString('utf8'), 'a');
      t.deepEqual(data.secondCall.args[0].toString('utf8'), 'b');
    });
});