const shell = require('shelljs');

const APP_VERSION = process.env.CI_COMMIT_TAG || process.env.CI_COMMIT_SHA || 'local-test';

const SENTRY_URL = process.env.SENTRY_URL;
const SENTRY_API_KEY = process.env.SENTRY_API_KEY;

// create release
shell.exec(`curl ${SENTRY_URL} -H 'Authorization: Bearer ${SENTRY_API_KEY}' -X POST -d '${JSON.stringify({version: APP_VERSION})}' -H 'Content-Type: application/json'`);

const files = ['all.min.js', 'libs.min.js'];
let exit = 0;
for (const file of files) {
  let c1 = shell.exec(`curl ${SENTRY_URL}${APP_VERSION}/files/ -H 'Authorization: Bearer ${SENTRY_API_KEY}' -X POST -F file=@www/${file} -F name=${file}`).code;
  let c2 = shell.exec(`curl ${SENTRY_URL}${APP_VERSION}/files/ -H 'Authorization: Bearer ${SENTRY_API_KEY}' -X POST -F file=@www/${file}.map -F name=${file}.map`).code;

  exit = exit || c1 || c2;
}

process.exit(exit);
