'use strict';

const test = require('ava');
const stream = require('stream');

const fauxerhose = require('../fauxerhose');

function format(records) {
  return {
    Records: [].concat(records).map(record => {
      const data = Buffer.from(record).toString('base64');
      return { kinesis: { data } };
    })
  };
}

test('throws when no destination is specified', t => {
  const err = t.throws(() => fauxerhose());
  t.deepEqual(err.message, 'fauxerhose: destination must be a function');
});

test('it returns the transform and destination instances', async t => {
  const handle = fauxerhose({
    transform: stream.PassThrough,
    destination: stream.PassThrough
  });

  const result = await handle(format('test'));
  
  t.true(result.transform instanceof stream.PassThrough);
  t.true(result.destination instanceof stream.PassThrough);
});
