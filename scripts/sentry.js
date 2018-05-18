const shell = require('shelljs');

const {
  version
} = require('../package.json');

console.log(`Uploading sourcemaps for v${version} to sentry`);
shell.exec(`./node_modules/.bin/sentry-cli --version`);
shell.exec(`./node_modules/.bin/sentry-cli info`);
shell.exec(`./node_modules/.bin/sentry-cli releases new ${version}`);
shell.exec(`./node_modules/.bin/sentry-cli releases files ${version} upload-sourcemaps --url-prefix / www/build`);
