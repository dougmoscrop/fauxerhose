# fauxerhose

This is a library indended to be used inside of a Lambda function attached to a Kinesis stream.

The goal is to give more control than what Kinesis Firehose offers. Firehose supports transformation but demands a 1:1 mapping between the transformed record and the original. This makes something like CloudWatch impossible to ship to Elasticsearch using Firehose, because CloudWatch sends gzipped sets of events as individual Kinesis Records.

## Usage

This would transform CloudWatch logs and then send them to S3

```js
const fauxerhose = require('fauxerhose');
const cloudwatch = require('fauxerhose-transform-cloudwatch')
const s3 = require('fauxerhose-destination-s3');

const handle = fauxerhose({
  transform: cloudwatch(),
  destination: s3({
    bucket: 'test',
    prefix: 'foo'
  })
});

// This is your Lambda
module.exports.handler = async event => {
  // these are instances of your Destination and Transform
  // in case you need something from them after processing is done
  const { transform, destination } = await handle(event);
};
```