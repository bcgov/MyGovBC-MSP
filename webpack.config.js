'use strict'
var HtmlWebpackPlugin = require("html-webpack-plugin")
var path = require('path')
var _ = require('lodash')
var localConfig = function () {
  return {}
}
try {
  localConfig = require(__dirname + '/config/webpack/environments/local')
}
catch (e) {
}
var serviceConfig = function () {
  return {}
}
try {
  serviceConfig = require(__dirname + '/config/webpack/environments/service')
}
catch (e) {
}

var _configs = {

  // global section
  global: require(__dirname + '/config/webpack/global'),

  // config by enviroments
  production: require(__dirname + '/config/webpack/environments/production'),
  development: require(__dirname + '/config/webpack/environments/development'),
  local: localConfig,
  service: serviceConfig
}

var _load = function () {
  console.log('Node process.env.NODE_ENV value set to: ' + process.env.NODE_ENV);
  var ENV = process.env.NODE_ENV
    ? process.env.NODE_ENV
    : 'development'

  console.log('Current Environment: ', ENV)

  // load config file by environment
  var webpackConfigs = _.mergeWith(
    _configs.global(__dirname),
    _configs[ENV](__dirname),
    _configs.service(__dirname),
    _configs.local(__dirname),
    function (objValue, srcValue) {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    }
  )

  // webpackConfigs.port = webpackConfigs.port || process.env.PORT || 8000
  if (ENV === 'development') {
    //ARC TODO - Unsure the purpose of these lines. Commenting out didn't seem to have any real change.
    //Documentation https://webpack.js.org/configuration/entry-context/
    //Implies that this line is unnecessary, but check webpack-dev-server docs first.

    // webpackConfigs.entry.unshift("webpack-dev-server/client?http://localhost:" + webpackConfigs.port + "/", "webpack/hot/dev-server") //orig
    webpackConfigs.entry.unshift("webpack-dev-server/client?http://localhost:" + webpackConfigs.devServer.port + "/") //ARC new. removes duplicates
  }

  webpackConfigs.plugins = webpackConfigs.plugins.concat([
    new HtmlWebpackPlugin({
      rootUrlPath: webpackConfigs.devServer.publicPath || '',
      headerFooterSvcUrl: webpackConfigs.headerFooterSvcUrl || '',
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html.ejs')
    })
  ])


  /**
   * Setup appConstants.ts by writing webpackConfigs.appConstants to it
   */
  webpackConfigs.module.loaders = (webpackConfigs.module.loaders || []).concat([
    {
      test: /\.(ts|js)$/,
      enforce: "pre",
      exclude: [
        path.resolve(__dirname, "node_modules")
      ],
      use: [{
        loader: 'string-replace-loader',
        query: {
          search: '\'__APP_CONSTANTS__\'',
          replace: JSON.stringify(webpackConfigs.appConstants)
        }
      }],
    }
  ])

  /**
   * We need to remove the appConstants attribute before returning the object
   * to webpack. Webpack validates objects rigorously in version 2, and
   * appConstants is an invalid custom attribute.  We make use of the
   * object, by overwriting the appConstants.ts file, then delete it.
   */

  delete webpackConfigs.appConstants
  return webpackConfigs
}

module.exports = _load()
