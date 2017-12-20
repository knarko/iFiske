// @ts-check
const shell = require('shelljs');
const { version } = require('./package.json');

var versionCode = mkVersionCode(version);

shell.sed('-i', /((?:ios-CFBundleVersion)|(?:android-versionCode))="\d*?"/g, `$1="${versionCode}"`, 'config.xml');

/**
 * @param {string} version
 */
function mkVersionCode(version) {
  return version
    .split('.')
    .map(part => {
      let s = '0' + part;
      return s.substr(s.length - 2);
    })
    .join('') + '000';
    // TODO: make the last part of the string depend on time or smth
}
