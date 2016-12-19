// var webpackConfig = require('./webpack/environments/test')
var webpackConfig = require('../webpack.config')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],
    preprocessors: {
      './config/karma-test-shim.js': ['coverage', 'webpack', 'sourcemap']
    },

    reporters: ['progress', 'mocha', 'coverage', 'remap-coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    //autoWatch: false,
    // Start these browsers, currently available:
    // - PhantomJS
    // - Chrome
    // - Firefox
    // - IE
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 30000,
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },
    coverageReporter: {
        type: 'in-memory'
    },
    remapCoverageReporter: {
        'text-summary': null,
        json: './coverage/coverage.json',
        html: './coverage/html'
    },
  })
}
