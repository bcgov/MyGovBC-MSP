var webpackConfig = require('./webpack.config.js');
webpackConfig.entry = {};

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    autoWatchBatchDelay: 300,

    files: [
      './node_modules/babel-polyfill/dist/polyfill.js',
      './src/app/index.vendor.js',
      './src/app/index.bootstrap.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './src/**/*.spec.js',
      './karma.spec.js'],

    preprocessors: {
      './src/app/index.vendor.js': ['webpack'],
      './src/app/index.bootstrap.js': ['webpack'],
      './src/**/*.spec.js': ['babel']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    }
  });
}