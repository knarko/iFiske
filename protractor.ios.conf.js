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
    platformName: 'iOS',
    autoWebview: true,
    autoGrantPermissions: true,
    unicodeKeyboard: true,
    resetKeyboard: true,
    deviceName: 'iPhone 6',
    automationName: 'XCUITest',
    app: '/Users/gustavbylund/prog/ifiske/platforms/ios/build/emulator/iFiske Fiskekort.app',
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },

  baseUrl: 'http://localhost:8080/Users/gustavbylund/Library/Developer/CoreSimulator/Devices/482343A9-DCAD-4900-9BBE-38E32AAB45B9/data/Containers/Bundle/Application/AE71EB17-3150-49FA-8615-65F0E6C99F7E/iFiske%20Fiskekort.app/www/index.html',

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
