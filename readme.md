## AWS-ES Connector helper

'http-aws-es' package didn't work with the updated elastcisearch client.

This package assumes that you are using 'aws-sdk'.

To use, first upate the AWS config.

```js
import AWS from 'aws-sdk';

AWS.config.update({
  credentials: new AWS.Credentials(accessKey, secretKey),
  region
});
```

import the client and pass the extended Connection class.

```js
import { Client } from '@elastic/elasticsearch';
import { AwsConnector } from './connector';

const client = new Client({
  node,
  Connection: AwsConnector
});

//use this client to talk to AWS managed ES service.
export default client;
```
