#! /usr/bin/env node

const shell = require('shelljs');

const sv = require('../src/assets/i18n/sv.json');
const en = require('../src/assets/i18n/en.json');
const de = require('../src/assets/i18n/de.json');


console.log('This script finds all the missing translation keys in english and german, by comparing to the keys in swedish, which is the main language.')
console.log('Missing keys below:\n')

function makeList(prefix, obj) {
  const list = [];
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] !== 'string') {
      list.concat(makeList(prefix + key + '.', obj[key]));
    } else {
      list.push(key);
    }
  }
  return list;
}

const svList = makeList('', sv);
const enList = makeList('', en);
const deList = makeList('', de);

svList.forEach(k => {
  if (enList.indexOf(k) === -1) {
    console.log('en missing:', k);
  }
});

svList.forEach(k => {
  if (deList.indexOf(k) === -1) {
    console.log('de missing:', k);
  }
});
