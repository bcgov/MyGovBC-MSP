// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './supp-benefits/src/mspsb-happy-path.e2e-spec.ts'
  ],
  multiCapabilities: [{
  // 'browserName': 'firefox'
  // }, {
    'browserName': 'chrome'
  }],
  directConnect: true,
  baseUrl: 'http://localhost:4300/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare: function() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    var jasmineReporters = require('jasmine-reporters');
 
    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function(config) {
        // you could use other properties here if you want, such as platform and version
        var browserName = config.capabilities.browserName;
 
        var junitReporter = new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: 'testresults',
            // this will produce distinct xml files for each capability
            filePrefix: browserName + '-xmloutput',
            modifySuiteName: function(generatedSuiteName, suite) {
                // this will produce distinct suite names for each capability,
                // e.g. 'firefox.login tests' and 'chrome.login tests'
                return browserName + '.' + generatedSuiteName;
            }
        });
        jasmine.getEnv().addReporter(junitReporter);
    });
  }
};