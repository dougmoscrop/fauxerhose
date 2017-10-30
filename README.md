# fauxerhose

This is a library indended to be used inside of a Lambda function attached to a Kinesis stream.

The goal is to give more control over Kinesis Firehose.

Firehose supports transformation but demands a 1:1 mapping between records before and after the transformation. This makes something like CloudWatch impossible to ship to Elasticsearch using Firehose, because CloudWatch sends gzipped sets of events as individual Kinesis Records. (So there's a 1:N mapping during the unzip transformation). It also happens that transformation isn't so easy to set up - at the time of writing this, neither CloudFormation nor Terraform support setting up a transform function.

## Usage

This would transform CloudWatch logs and then send them to Elasticsearch

```js
const fauxerhose = require('fauxerhose');
const cloudwatch = require('fauxerhose-transform-cloudwatch')
const elasticsearch = require('fauxerhose-destination-elasticsearch');

const handle = fauxerhose({
  transform: cloudwatch(),
  destination: elasticsearch({
    index: 'test'
  })
});

// This is your Lambda
module.exports.handler = function(event, context, callback) {
  handle(event)
    .then(() => callback())
    .catch(e => callback(e));
};
```