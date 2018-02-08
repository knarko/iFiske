// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter');

exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',
  allScriptsTimeout: 150000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    browserName: "",
    'appium-version': '1.6',
    platformName: 'android',
    autoWebview: true,
    autoGrantPermissions: true,
    unicodeKeyboard: true,
    resetKeyboard: true,
    deviceName: 'LGD8558e1900bb',
    app: '/home/maistho/prog/ifiske/platforms/android/build/outputs/apk/debug/android-debug.apk',
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  baseUrl: 'file:///android_asset/www/index.html',

  useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },

  onPrepare: function() {
   //  jasmine.getEnv().addReporter(new SpecReporter());
    var wd = require('wd'),
      protractor = require('protractor'),
      wdBridge = require('wd-bridge')(protractor, wd);
      wdBridge.initFromProtractor(exports.config);
  }
};
