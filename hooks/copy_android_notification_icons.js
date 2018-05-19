#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

const icon_sizes = [
  'hdpi',
  'mdpi',
  'xhdpi',
  'xxhdpi',
  'xxxhdpi',
];

module.exports = function (context) {
  // no need to configure below
  const rootdir = context.opts.projectRoot;
  icon_sizes.forEach(size => {
    const srcfile = `resources/android/res/drawable-${size}/ic_stat_icon.png`;
    const destfile = `platforms/android/res/drawable-${size}/ic_stat_onesignal_default.png`;
    console.log(`copying ${srcfile} to ${destfile}`);

    const destdir = path.dirname(destfile);

    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
      fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
    }
  });
};
