var shell = require('shelljs');

const APP_VERSION = process.env.CI_COMMIT_TAG || process.env.CI_COMMIT_SHA || 'local-test';

function replace() {
  shell.sed('-i', /__REPLACE_WITH_ACTUAL_BUNDLE_VERSION__/g, process.env.CI_BUILD_ID, 'config.xml');
  shell.sed('-i', /__REPLACE_WITH_APP_VERSION__/g, APP_VERSION, 'src/lib/raven.js');
}

module.exports = replace;

if (require.main === module) {
  replace();
}
