#! /usr/bin/env node
// @ts-check

const shell = require('shelljs');
const inquirer = require('inquirer');
const fs = require('fs');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

const packageJson = require('../package.json');

const splitVersion = (version) => {
  let [major, minor, patch] = version.split('.').map(part => Number(part));
  return { major, minor, patch };
}

const mergeVersion = ({ major, minor, patch }) => {
  return `${major}.${minor}.${patch}`;
}
const makeVersionCode = ({ major, minor, patch }) => {
  const pad = (num, len) => {
    let s = '00000' + num;
    return s.substr(s.length - len);
  };

  return Number(`${pad(major, 3)}${pad(minor, 3)}${pad(patch, 4)}`);
};


const deploy = async () => {
  if (!shell.which('git')) {
    console.log('Could not find git in PATH');
    process.exit(1);
  }
  if (shell.exec('git diff --quiet --exit-code package.json config.xml').code || shell.exec('git diff --cached --quiet --exit-code').code) {
    console.log('Pending changes, aborting');
    process.exit(2);
  }

  let { version } = packageJson;

  let versions = splitVersion(version);

  console.log(`You are on v${version}`);

  const { bump } = await inquirer.prompt([{
    type: 'list',
    name: 'bump',
    message: 'What type of release is this?',
    choices: ['Major', 'Minor', 'Patch', 'Custom'],
    filter: function (val) {
      return val.toLowerCase();
    }
  }]);


  if (bump === 'custom') {
    const { next, sourcemaps, push } = await inquirer.prompt([{
      type: 'input',
      name: 'next',
      message: 'What is the new version number?',
      validate: value => {
        if (value.match(/^\d+\.\d+\.\d+$/)) {
          return true;
        }
        return `'${value}' is not a valid version number`;
      },
    }]);
    versions = splitVersion(next);
  } else {
    versions[bump]++;
  }

  const { sourcemaps, push } = await inquirer.prompt([{
    type: 'confirm',
    name: 'sourcemaps',
    message: 'Do you want to upload source maps to Ionic Pro?',
    default: false,
  }, {
    type: 'confirm',
    name: 'push',
    message: 'Do you want to push to Ionic Pro immediately?',
    default: false,
  }]);
  switch (bump) {
    case 'major':
      versions.minor = 0;
    case 'minor':
      versions.patch = 0;
      break;
  }
  version = mergeVersion(versions);
  packageJson.version = version;

  await writeFile('./package.json', JSON.stringify(packageJson, null, 2));

  const versionCode = makeVersionCode(versions);
  shell.sed('-i', /((?:ios-CFBundleVersion)|(?:android-versionCode))="\d*?"/g, `$1="${versionCode}"`, 'config.xml');
  shell.sed('-i', /(\<widget [^>]*? version)="\d+\.\d+\.\d+"/g, `$1="${version}"`, 'config.xml');

  shell.exec('npm run changelog')

  shell.exec('git add package.json config.xml CHANGELOG.md')
  shell.exec(`git commit -m "chore: release v${version}"`)
  shell.exec(`git tag -a v${version} -m "release v${version}"`)

  console.log(`Tagged a release as v${version}`);

  if (sourcemaps) {
    shell.exec(`npm run build`);
    shell.exec(`ionic monitoring syncmaps --no-interactive`);
  }

  if (push) {
    shell.exec(`git push ionic master`);
  } else {
    console.log(`Now all you need to do is\n$ git push ionic master`);
  }
};


deploy();

