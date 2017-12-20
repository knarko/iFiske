var shell = require('shelljs');

shell.sed('-i', /__REPLACE_WITH_ACTUAL_BUNDLE_VERSION__/g, process.env.CI_BUILD_ID, 'config.xml');

