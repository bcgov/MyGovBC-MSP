'use strict'

// Depends
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var NODE_ENV = process.env.NODE_ENV || "production"
var DEVELOPMENT = NODE_ENV === "production" ? false : true
// for displaying the in-maintenance message
var MSP_IS_IN_MAINTENANCE_FLAG = process.env.mspIsInMaintenanceFlag
var MSP_IS_IN_MAINTENANCE_TEXT = process.env.mspIsInMaintenanceText
var stylesLoaderV2 = ['css-loader', 'sourceMap-loader', 'postcss-loader', 'sass-loader']

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
          use: [{ loader: "html-loader" }]
        },
        {
          test: /\.md$/, use: [
            {
              loader: "html-loader"
            },
            {
              loader: "markdown-loader"
            }]
        },
        {
          test: /\.css$/,
          use: DEVELOPMENT ? ['style-loader', 'css-loader', 'sourceMap-loader', 'postcss-loader'] : ExtractTextPlugin.extract({ fallback: "style-loader", use: ['css-loader', 'sourceMap-loader', 'postcss-loader'] })
        }, {
          test: /\.less$/,
          use: DEVELOPMENT ? ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] : ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "postcss-loader", "less-loader"] })
        }, {
          test: /\.(scss|sass)$/,
          use: DEVELOPMENT ? (['style-loader'].concat(stylesLoaderV2)) : ExtractTextPlugin.extract({ fallback: 'style-loader', use: stylesLoaderV2 })
        }, {
          test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "assets/fonts/[name]_[hash].[ext]"
              }
            }
          ]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                name: "name=assets/images/[name]_[hash].[ext]",
                limit: 10000
              }
            }
          ]
        }
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV),
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer({ browsers: ['last 5 versions'] })]
        }
      }),
      //Removes an Angular 2 warning.  Note: May have to change when upgrading to Angular 4+
      //https://github.com/angular/angular/issues/11580
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.resolve(__dirname, 'doesnotexist/')
      ),
      new webpack.NoEmitOnErrorsPlugin(), //ARC new todo
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
      // new ExtractTextPlugin('assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css', {allChunks: true})
      new ExtractTextPlugin({
        filename: 'assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css',
        allChunks: true
      })
    ],
    //ARC TODO - Orig is above.
    devServer: {
      publicPath: '/msp',
      contentBase: './dist',
      // info: true, //orig
      hot: true,
      inline: true,
      port: 8000,
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
    /**
     * AppConstants can be defined here, or in the environment files as needed:
     *    /config/webpack/environments/development.js, local.js, etc.
     */
    appConstants: {
      runtimeEnv: NODE_ENV, // run-time environment. by default same as build-time node env
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
      mspIsInMaintenanceFlag: MSP_IS_IN_MAINTENANCE_FLAG,
      mspIsInMaintenanceText: MSP_IS_IN_MAINTENANCE_TEXT
    },
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
