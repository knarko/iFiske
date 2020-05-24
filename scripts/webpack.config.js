const config = require('@ionic/app-scripts/config/webpack.config');
const path = require('path');

const alias = {
  'fuse.js': path.resolve(
    __dirname,
    '../node_modules/fuse.js/dist/fuse.common.js',
  ),
};

config.dev.resolve.alias = {
  ...alias,
};
config.prod.resolve.alias = {
  ...alias,
};

module.exports = config;
