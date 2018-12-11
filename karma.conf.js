// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma'),
        require('karma-spec-reporter')
      ],
      client:{
        clearContext: false // leave Jasmine Spec Runner output visible in browser
      },
      files: [
        
      ],
      preprocessors: {
        
      },
      mime: {
        'text/x-typescript': ['ts','tsx']
      },
      coverageIstanbulReporter: {
        dir: require('path').join(__dirname, 'coverage'), reports: [ 'html', 'lcovonly' ],
        fixWebpackSourcePaths: true
      },
      angularCli: {
        environment: 'dev'
      },
      reporters: config.angularCli && config.angularCli.codeCoverage
                ? ['progress', 'coverage-istanbul']
                // : ['progress', 'kjhtml'],
                : ['spec', 'kjhtml'],
      specReporter: {
        suppressSkipped: true,      // do not print information about skipped tests
        showSpecTiming: true,      // print the time elapsed for each spec
        failFast: config.angularCli && config.angularCli.singleRun              // test would finish with error when a first fail occurs. 
      },
  
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['ChromeHeadless'],
      singleRun: false,

      /** * maximum number of tries a browser will attempt in the case of a disconnection */ 
      browserDisconnectTolerance: 3,
      /** * How long will Karma wait for a message from a browser before disconnecting from it (in ms). */
      browserNoActivityTimeout: 30000,

    });
  };
  
