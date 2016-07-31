'use strict'
var HtmlWebpackPlugin = require("html-webpack-plugin")
var path = require('path')
var _ = require('lodash')
let localConfig = function () {
  return {}
}
try {
  localConfig = require(__dirname + '/config/webpack/environments/local')
}
catch (e) {
}
var _configs = {

  // global section
  global: require(__dirname + '/config/webpack/global'),

  // config by enviroments
  production: require(__dirname + '/config/webpack/environments/production'),
  development: require(__dirname + '/config/webpack/environments/development'),
  local: localConfig
}

var _load = function () {
  var ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'development'

  console.log('Current Environment: ', ENV)

  // load config file by environment
  var webpackConfigs = _.mergeWith(
    _configs.global(__dirname),
    _configs[ENV](__dirname),
    _configs.local(__dirname), function (objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }
  )

  webpackConfigs.port = webpackConfigs.port || process.env.PORT || 8000
  if (ENV === 'development') {
    webpackConfigs.entry.app.unshift("webpack-dev-server/client?http://localhost:" + webpackConfigs.port + "/")
  }

  webpackConfigs.plugins = webpackConfigs.plugins.concat([
    new HtmlWebpackPlugin({
      rootUrlPath: webpackConfigs.devServer.publicPath || '',
      headerFooterSvcUrl: webpackConfigs.headerFooterSvcUrl || '',
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html.ejs')
    })
  ])

  webpackConfigs.module.loaders = webpackConfigs.module.loaders.concat([
    {
      test: /\.js$/,
      exclude: [
        path.resolve(__dirname, "node_modules")
      ],
      loader: 'string-replace',
      query: {
        search: '__APP_CONSTANTS__',
        replace: JSON.stringify(webpackConfigs.appConstants)
      }
    }
  ])
  return webpackConfigs
}

module.exports = _load()
