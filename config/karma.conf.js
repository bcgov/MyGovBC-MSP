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
    // - PhantomJS
    // - Chrome
    // - Firefox
    // - IE
    browsers: ['PhantomJS'],
    singleRun: true,
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    }
  })
}
