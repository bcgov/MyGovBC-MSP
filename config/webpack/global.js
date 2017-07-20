'use strict'

// Depends
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var NODE_ENV = process.env.NODE_ENV || "production"
var DEVELOPMENT = NODE_ENV === "production" ? false : true

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
      extensions: ['.js', '.ts'],
      modules: ['node_modules'],
      alias: {
        _appRoot: path.join(_path, 'src', 'app'),
        _images: path.join(_path, 'src', 'app', 'assets', 'images'),
        _stylesheets: path.join(_path, 'src', 'app', 'assets', 'styles'),
        _scripts: path.join(_path, 'src', 'app', 'assets', 'js')
      }
    },

    // modules resolvers
    module: {
      loaders: [
        {
          test: /\.ts$/,
          use: [
            { loader: "awesome-typescript-loader" },
            { loader: "angular2-template-loader" }
          ]
        },
        {
          test: /\.html$/,
          use: [{ loader: "html-loader" }]
        },
        {
          test: /\.md$/, use: [
            { loader: "html-loader" },
            { loader: "markdown-loader" }
          ]
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true
                }
              },
              { loader: "sourceMap-loader" },
              { loader: "postcss-loader" }
            ]
          })
        }, {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                options: {
                  sourceMap: true,
                }
              },
              { loader: 'postcss-loader' },
              { loader: 'less-loader' }
            ],
          })
        }, {
          test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: "url-loader",
            options: {
              name: "assets/fonts/[name]_[hash].[ext]"
            }
          }]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          use: [{
            loader: "url-loader",
            options: {
              name: "name=assets/images/[name]_[hash].[ext]",
              limit: 10000
            }
          }]
        }
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.mspIsInMaintenanceFlag': JSON.stringify(process.env.mspIsInMaintenanceFlag),
        'process.env.mspIsInMaintenanceText': JSON.stringify(process.env.mspIsInMaintenanceText),
        'process.env.mspIsInMaintenanceTimes': JSON.stringify(process.env.mspIsInMaintenanceTimes)
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer({ browsers: ['last 5 versions'] })]
        }
      }),
      //Removes an ng2 warning.  Note: May change when upgrading to Angular 4+
      //https://github.com/angular/angular/issues/11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve(__dirname, 'doesnotexist/')
      ),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.AggressiveMergingPlugin({
        moveToParents: true
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        async: true,
        children: true,
        minChunks: Infinity
      }),
      new ExtractTextPlugin({
        filename: 'assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css',
        allChunks: true
      })
    ],
    //devServer declared to avoid undefined errors. Content is in development.ts
    devServer: {},
    /**
     * AppConstants can be defined here or in environment files. Remember,
     * environment files will override values here.
     */
    appConstants: {
      runtimeEnv: NODE_ENV, // run-time env. by default same as build-time node env
      coreApiBaseUrl: 'http://localhost:9000/api',
      serviceName: 'core',
      apiBaseUrl: '/msp/api',
      // apiBaseUrl: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca/api',
      captchaApiBaseUrl: '/msp/api/captcha',
      images: {
        maxImagesPerPerson: 50,
        maxWidth: 2600,
        maxHeight: 3300,
        minWidth: 0,
        minHeight: 0,
        maxSizeBytes: 1048576,
        reductionScaleFactor: 0.8,
        acceptMimeType: "image/*",
        convertToMimeType: "image/jpeg",
        jpegQuality: 0.5
      },
      // general state of the app, if unavailable, display Unavailable message and don't continue
      mspIsInMaintenanceFlag: process.env.mspIsInMaintenanceFlag,
      mspIsInMaintenanceText: process.env.mspIsInMaintenanceText,
      mspIsInMaintenanceTimes: process.env.mspIsInMaintenanceTimes
    },
  }

  return webpackConfig
}