'use strict';

const stream = require('stream');

const forward = require('stream-forward');

module.exports = function source(event) {
  const records = event.Records || [];
  const end = records.length;

  let position = 0;

  return forward(new stream.Readable({
    objectMode: true,
    read: function(amount) {
      for (let stop = position + amount; position < stop; position++) {
        if (position === end) {
          this.push(null);
          return;
        }

        const record = records[position];

        try {
          if (record.kinesis && record.kinesis.data) {
            const data = Buffer.from(record.kinesis.data, 'base64');
            this.push(data);
          } else {
            throw new Error('record missing kinesis.data');
          }
        } catch (e) {
          this.emit('invalid', { reason: e.message, record });
        }
      }
    }
  }), { events: ['invalid'] });
};