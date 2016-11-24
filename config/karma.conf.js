var webpackConfig = require('./webpack/environments/test')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - Firefox
    // - IE
    // - IE10
    // - IE9
    // - PhantomJS
    browsers: ['PhantomJS'],
    singleRun: true,
    autoWatchBatchDelay: 300,

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    }
  })
}
