const fs = require('fs');
const {
  promisify
} = require('util');
const writeFile = promisify(fs.writeFile);
const packageJson = require('../package.json');
packageJson.scripts = {};
writeFile('./ionic-pro/package.json', JSON.stringify(packageJson, null, 2));
