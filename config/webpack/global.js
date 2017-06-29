'use strict'

// Depends
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var NODE_ENV = process.env.NODE_ENV || "production"
var DEVELOPMENT = NODE_ENV === "production" ? false : true
var stylesLoader = 'css-loader?sourceMap!postcss-loader!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
var stylesLoaderV2 = ['css', 'sourceMap', 'postcss', 'sass']

/**
 * TODO 
 * 
 *    - Get query params from stylesLoader into stylesLaoderV2
 *      - e.g. ?=xxx
 *    - Ensure ExractText is properly migrated, esp the `use` field (some have ?= params)
 *  
 */


module.exports = function (_path) {
  var rootAssetPath = _path + 'src'

  var webpackConfig = {
    // entry points
    entry: [_path + '/src/polyfills', _path + '/src/vendor', _path + '/src/main'],

    // output system
    output: {
      path: require("path").resolve("dist"),
      filename: '[name].js',
      publicPath: '/msp/',
    },

    // resolves modules
    resolve: {
      // extensions: ['', '.js', '.ts'], //orig
      extensions: ['.js', '.ts'], //ARC
      // modulesDirectories: ['node_modules'], //orig
      modules: ['node_modules'], //ARC
      alias: {
        _appRoot: path.join(_path, 'src', 'app'),
        _images: path.join(_path, 'src', 'app', 'assets', 'images'),
        _stylesheets: path.join(_path, 'src', 'app', 'assets', 'styles'),
        _scripts: path.join(_path, 'src', 'app', 'assets', 'js')
      }
    },

    // modules resolvers
    module: {
      // noParse: [], //ARC TODO, safe to remove?
      loaders: [
        {
          test: /\.ts$/,
          // loaders: ['awesome-typescript-loader', 'angular2-template-loader']
          use: [
            {
              loader: "awesome-typescript-loader"
            },
            {
              loader: "angular2-template-loader"
            }
          ]
        },
        {
          test: /\.html$/,
          // loaders: [
          //   'html'
          // ]
          use: [{ loader: "html" }]
        },
        // { test: /\.md$/, loader: "html!markdown" },
        {
          test: /\.md$/, use: [
            {
              loader: "html"
            },
            {
              loader: "markdown"
            }]
        },
        {
          test: /\.css$/,
          // loader: DEVELOPMENT ? 'style!css?sourceMap!postcss' : ExtractTextPlugin.extract({ fallback: "style-loader", use: 'css?sourceMap!postcss' })
          use: DEVELOPMENT ? ['style', 'css', 'sourceMap', 'postcss'] : ExtractTextPlugin.extract({ fallback: "style-loader", use: ['css', 'sourceMap', 'postcss'] })
        }, {
          test: /\.less$/,
          // loader: DEVELOPMENT ? "style!css!postcss!less" : ExtractTextPlugin.extract({ fallback: "style", use: "css!postcss!less" })
          use: DEVELOPMENT ? ['style', 'css', 'postcss', 'less'] : ExtractTextPlugin.extract({ fallback: "style", use: ["css", "postcss","less"] })
        }, {
          test: /\.(scss|sass)$/,
          // loader: DEVELOPMENT ? ('style!' + stylesLoader) : ExtractTextPlugin.extract({ fallback: 'style', use: stylesLoader })
          use: DEVELOPMENT ? ('style!' + stylesLoader) : ExtractTextPlugin.extract({ fallback: 'style', use: stylesLoader })
        }, {
          test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // loaders: [
          //   "url-loader?name=assets/fonts/[name]_[hash].[ext]"
          // ]
          use: [
            {
              loader: "url",
              options: {
                name: "assets/fonts/[name]_[hash].[ext]"
              }
            }
          ]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          // loaders: [
          //   'url-loader?name=assets/images/[name]_[hash].[ext]&limit=10000'
          // ]
          use: [
            {
              loader: "url",
              options: {
                name: "name=assets/images/[name]_[hash].[ext]",
                limit: 10000
              }
            }
          ]
        }
      ],
    },

    // post css
    //ARC TODO - Find out how to get postCSS in webpack2
    // postcss: [autoprefixer({ browsers: ['last 5 versions'] })],

    // load plugins
    plugins: [
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }),
      new webpack.NoErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.AggressiveMergingPlugin({
        moveToParents: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        async: true,
        children: true,
        minChunks: Infinity
      }),
      // new ExtractTextPlugin('assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css', {allChunks: true})
      new ExtractTextPlugin({
        filename: 'assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css',
        allChunks: true
      })
    ],
    devServer: {
      publicPath: '/msp',
      contentBase: './dist',
      info: true,
      hot: true,
      inline: true,
      historyApiFallback: {
        index: '/msp'
      },
      watchOptions: {
        poll: 1000,
      },
      proxy: {
        '/msp/api': {
          target: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca',
          changeOrigin: true,
          secure: false
        }
      }
    },
    // constants injected to app
    /**
     * ARC - appConstants is unexpected webpack property and is invalid, 
     *  Move into options possible?
     *  Otherwise use DefinePlugin to define constants
     * 
     * also need changes in:
     *    webpack.config.js
     *    config/webpack/environments/service.js
     */

    // appConstants: {
    //   runtimeEnv: NODE_ENV, // run-time environment. by default same as build-time node env
    //   coreApiBaseUrl: 'http://localhost:9000/api',
    //   serviceName: 'core',
    //   apiBaseUrl: '/msp/api',
    //   // apiBaseUrl: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca/api',
    //   captchaApiBaseUrl: '/msp/api/captcha',
    //   images: {
    //     maxImagesPerPerson: 50,
    //     maxWidth: 2600,
    //     maxHeight: 3300,
    //     minWidth: 0,
    //     minHeight: 0,
    //     maxSizeBytes: 1048576,
    //     reductionScaleFactor: 0.8,
    //     acceptMimeType: "image/*",
    //     convertToMimeType: "image/jpeg",
    //     jpegQuality: 0.5
    //   }
    // },
    // htmlLoader: {
    //   minimize: false,
    // }
  }

  //ARC - Why is this not in dev file? TODO
  if (NODE_ENV !== 'development') {
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        warnings: false,
        sourceMap: true
      })
    ])
  }

  return webpackConfig

}
