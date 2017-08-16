var shell = require('shelljs');

var replace = require('./set_bundle_version');

var platform = process.argv[2];
if (['android', 'ios', 'both'].indexOf(platform) === -1) {
  console.log('Usage: npm run package -- [android|ios|both]');
  process.exit(1);
}

shell.rm('www/*.map');
shell.exec(`ionic cordova platform add ${platform} --no-interactive -r`);

shell.config.fatal = true;

shell.exec(`ionic cordova resources ${platform} --no-interactive`);
replace();
let ids = makePackage(platform);
ids.forEach(id => {
  download(id);
});

function makePackage(platform) {
  if (platform === 'both') {
    return makePackage('android').concat(makePackage('ios'));
  }
  console.log('\nPackaging ' + platform);
  shell.sed('-i', 'gulp\\.task\\(\'ionic', '//', 'gulpfile.js');
  let res = shell.exec(`ionic package build ${platform} --prod --release -p prod --no-interactive`);
  let [_, id] = /^\[OK\] Build ([0-9]+) has been submitted!$/m.exec(res.stdout);
  return [id];
}

function download(id) {
  let sleepTime = 1;
  let exitCode = 1;
  let res;
  const start = Date.now();
  process.stdout.write('Waiting for build to complete');
  shell.config.fatal = false;
  for (let sleepTime = 1; exitCode && start - Date.now() < 10 * 60 * 1000; shell.exec(`sleep ${sleepTime++}`)) {
    process.stdout.write('.');
    res = shell.exec(`ionic package download ${id}`, {silent: true});
    exitCode = res.code;
  }
  process.stdout.write('\n');
  shell.config.fatal = false;
  console.log(res.stdout);
}
