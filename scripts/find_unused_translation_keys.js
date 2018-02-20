#! /usr/bin/env node

const shell = require('shelljs');

const sv = require('../src/assets/i18n/sv.json');


console.log('This script finds all the unused translation keys in swedish, which is the main language.')
console.log('Unused keys below:\n')

function traverseKeys(prefix, obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] !== 'string') {
      traverseKeys(prefix + key + '.', obj[key]);
    } else {
      const code = shell.exec(`rg '${prefix}${key}' src -qg '!src/assets'`).code;
      if (code) {
        console.log(`${prefix}${key}`);
      }
    }
  }
}

traverseKeys('', sv);
