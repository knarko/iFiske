const shell = require('shelljs');

const packageJson = require('../package.json');

let {
  version
} = packageJson;

shell.exec(`./node_modules/.bin/sentry-cli info`);
shell.exec(`./node_modules/.bin/sentry-cli releases new ${version}`);
shell.exec(`./node_modules/.bin/sentry-cli releases files ${version} upload-sourcemaps --url-prefix / www/build`);
