import AWS from 'aws-sdk';
import { Connection } from '@elastic/elasticsearch';

class AwsConnector extends Connection {
  async request(params, callback) {
    try {
      const creds = await this.getAWSCredentials();
      const req = this.createRequest(params);

      const { request: signedRequest } = this.signRequest(req, creds);
      super.request(signedRequest, callback);
    } catch (error) {
      throw error;
    }
  }

  createRequest(params) {
    const endpoint = new AWS.Endpoint(this.url.href);
    let req = new AWS.HttpRequest(endpoint);

    Object.assign(req, params);
    req.region = AWS.config.region;

    if (!req.headers) {
      req.headers = {};
    }

    let body = params.body;

    if (body) {
      let contentLength = Buffer.isBuffer(body)
        ? body.length
        : Buffer.byteLength(body);
      req.headers['Content-Length'] = contentLength;
      req.body = body;
    }
    req.headers['Host'] = endpoint.host;

    return req;
  }

  getAWSCredentials() {
    return new Promise((resolve, reject) => {
      AWS.config.getCredentials((err, creds) => {
        if (err) {
          if (err && err.message) {
            err.message = `AWS Credentials error: ${e.message}`;
          }

          reject(err);
        }

        resolve(creds);
      });
    });
  }

  signRequest(request, creds) {
    const signer = new AWS.Signers.V4(request, 'es');
    signer.addAuthorization(creds, new Date());
    return signer;
  }
}

module.exports = { AwsConnector };
