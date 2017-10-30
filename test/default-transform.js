'use strict';

const test = require('ava');

const helpers = require('./_helpers');

test('skips a record with no kinesis)', t => {
  return helpers.run({
    Records: [{ test: 'test' }]
  })
    .then(({ invalid }) => {
      t.deepEqual(invalid.length, 1);
    });
});

test('skips a record with no kinesis.data)', t => {
  return helpers.run({
    Records: [{ kinesis: {} }]
  })
    .then(({ invalid }) => {
      t.deepEqual(invalid.length, 1);
    });
});

test('delivers a decoded, raw record', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode('abc') } }]
  })
    .then(({ valid, invalid }) => {
      t.deepEqual(invalid, []);
      t.deepEqual(valid, [{ raw: 'abc' }]);
    });
});

test('deilvers a decoded, unparsed record', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode({ test: 'data' })} }]
  })
    .then(({ valid, invalid }) => {
      t.deepEqual(invalid, []);
      t.deepEqual(valid, [{ test: 'data' }]);
    });
});

test('deilvers a decoded, parsed non-object record', t => {
  return helpers.run({
    Records: [{ kinesis: { data: helpers.encode(JSON.stringify('test'))} }]
  })
    .then(({ valid, invalid }) => {
      t.deepEqual(invalid, []);
      t.deepEqual(valid, [{ parsed: 'test' }]);
    });
});

test('skips / delivers messages in the same event', t => {
  return helpers.run({
    Records: [{ test: 'test' }, { kinesis: { data: helpers.encode({ test: 'data' })} }, { kinesis: {} }, { kinesis: { data: helpers.encode('abc') } }]
  })
    .then(({ valid, invalid }) => {
      t.deepEqual(invalid, [{ reason: 'record missing kinesis.data', record: { test: 'test' } }, { reason: 'record missing kinesis.data', record: { kinesis: {} } }]);
      t.deepEqual(valid, [{ test: 'data' }, { raw: 'abc' }]);
    });
});
