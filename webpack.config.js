'use strict'
var HtmlWebpackPlugin = require("html-webpack-plugin")
var path = require('path')
var _ = require('lodash')

/**
 * This is the master webpack config file. Almost all webpack configuration should happen in the environmental files directly (i.e. development.js, production.js, service.js, local.js).
 * 
 * Responsibilities:
 *    * Load all environmental config files, ensuring more specific files overwrite general files.
 *    * Create the webpack config object (by merging environmental configs), and pass directly to webpack.
 *    * Define plugins that require certain settings (e.g. devServer) that aren't available when instantiating plugins in the regular config files. 
 */

//local.js and service.js are optional, so load them if they exist
var localConfig = function () { return {} }
try { localConfig = require(__dirname + '/config/webpack/environments/local') }
catch (e) { }

var serviceConfig = function () { return {} }
try { serviceConfig = require(__dirname + '/config/webpack/environments/service') }
catch (e) { }

//Load the remaining config files
var _configs = {
  global: require(__dirname + '/config/webpack/global'),
  production: require(__dirname + '/config/webpack/environments/production'),
  development: require(__dirname + '/config/webpack/environments/development'),
  local: localConfig,
  service: serviceConfig
}

var _load = function () {
  // for debugging of env variables only:
  // console.log('all env variables:' + JSON.stringify(process.env));
  console.log('Node process.env.NODE_ENV value set to: ' + process.env.NODE_ENV);
  var ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
  console.log('Current Environment: ', ENV)

  // merge configs, selecting the env config file
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

  /**
   * While most plugins should be defined in global.js or other env configs,
   * these plugins need access to pre-existing config values and as such
   * have to be defined _after_ those env configs are already established.
   */

  webpackConfigs = addHtmlPlugin(webpackConfigs);
  webpackConfigs = addStringReplacePlugin(webpackConfigs);

  /**
   * We need to remove the appConstants attribute before returning the object
   * to webpack. Webpack validates objects rigorously in version 2, and
   * appConstants is an invalid custom attribute.  We make use of the
   * object, by overwriting the appConstants.ts file, then delete it.
   */

  delete webpackConfigs.appConstants
  return webpackConfigs
}

function addStringReplacePlugin(webpackConfigs) {
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
  ]);

  return webpackConfigs;
}

function addHtmlPlugin(webpackConfigs) {
  webpackConfigs.plugins = webpackConfigs.plugins.concat([
    new HtmlWebpackPlugin({
      rootUrlPath: webpackConfigs.devServer.publicPath || '',
      headerFooterSvcUrl: webpackConfigs.headerFooterSvcUrl || '',
      filename: 'index.html',
      template: path.join(__dirname, 'src', 'index.html.ejs')
    })
  ]);

  return webpackConfigs;
}

module.exports = _load()