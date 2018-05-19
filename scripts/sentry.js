const shell = require('shelljs');

const packageJson = require('../package.json');

let {
  version
} = packageJson;

console.log(version);

shell.exec(`./node_modules/.bin/sentry-cli --version`);
shell.exec(`./node_modules/.bin/sentry-cli info`);
shell.exec(`./node_modules/.bin/sentry-cli releases new 1.2.3`);
shell.exec(`./node_modules/.bin/sentry-cli releases files 1.2.3 upload-sourcemaps --url-prefix / www/build`);
