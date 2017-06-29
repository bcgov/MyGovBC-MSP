'use strict'

// Depends
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var NODE_ENV = process.env.NODE_ENV || "production"
var DEVELOPMENT = NODE_ENV === "production" ? false : true
// var stylesLoader = 'css-loader?sourceMap!postcss-loader!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'
var stylesLoaderV2 = ['css-loader', 'sourceMap-loader', 'postcss-loader', 'sass-loader']

var debugAppConstants = {
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
  }
}

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
        // {
        //   test: /\.(ts|js)$/,
        //   enforce: "pre",
        //   exclude: [
        //     path.resolve(__dirname, "node_modules")
        //   ],
        //   use: [{
        //     loader: 'string-replace-loader',
        //     query: {
        //       search: '\'__APP_CONSTANTS__\'',
        //       // replace: JSON.stringify(process.env.appConstants)
        //       replace: JSON.stringify(debugAppConstants)
        //       // replace: JSON.stringify(appConstants)
        //     }
        //   }],
        // },
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
          use: [{ loader: "html-loader" }]
        },
        // { test: /\.md$/, loader: "html!markdown" },
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
          // loader: DEVELOPMENT ? 'style!css?sourceMap!postcss' : ExtractTextPlugin.extract({ fallback: "style-loader", use: 'css?sourceMap!postcss' })
          use: DEVELOPMENT ? ['style-loader', 'css-loader', 'sourceMap-loader', 'postcss-loader'] : ExtractTextPlugin.extract({ fallback: "style-loader", use: ['css-loader', 'sourceMap-loader', 'postcss-loader'] })
        }, {
          test: /\.less$/,
          // loader: DEVELOPMENT ? "style!css!postcss!less" : ExtractTextPlugin.extract({ fallback: "style", use: "css!postcss!less" })
          use: DEVELOPMENT ? ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'] : ExtractTextPlugin.extract({ fallback: "style-loader", use: ["css-loader", "postcss-loader", "less-loader"] })
        }, {
          test: /\.(scss|sass)$/,
          // loader: DEVELOPMENT ? ('style!' + stylesLoader) : ExtractTextPlugin.extract({ fallback: 'style', use: stylesLoader })
          // use: DEVELOPMENT ? ('style!' + stylesLoader) : ExtractTextPlugin.extract({ fallback: 'style', use: stylesLoader })
          use: DEVELOPMENT ? (['style-loader'].concat(stylesLoaderV2)) : ExtractTextPlugin.extract({ fallback: 'style-loader', use: stylesLoaderV2 })
        }, {
          test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          // loaders: [
          //   "url-loader?name=assets/fonts/[name]_[hash].[ext]"
          // ]
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
          // loaders: [
          //   'url-loader?name=assets/images/[name]_[hash].[ext]&limit=10000'
          // ]
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

    // load plugins
    plugins: [
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(NODE_ENV),
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer({ browsers: ['last 5 versions'] })]
        }
      }),
      //ARC TODO - Unsure if this is actually removing the warning.
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)@angular/,
        path.resolve(__dirname, '../src')
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
    //ORIG ORIG
    // devServer: {
    //   publicPath: '/msp',
    //   contentBase: './dist',
    //   info: true,
    //   hot: true,
    //   inline: true,
    //   historyApiFallback: {
    //     index: '/msp'
    //   },
    //   watchOptions: {
    //     poll: 1000,
    //   },
    //   proxy: {
    //     '/msp/api': {
    //       target: 'https://mygovbc-msp-dev.pathfinder.gov.bc.ca',
    //       changeOrigin: true,
    //       secure: false
    //     }
    //   }
    // },
    //ARC TODO - Orig is above.
    devServer: {
      publicPath: '/msp',
      contentBase: './dist',
      // info: true, //orig
      hot: true,
      inline: true,
      port: 8000, //ARC NEW TODO VERIFY
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
     * AppConstants can be defined here, or in the config files as appropriate:
     *    /config/webpack/environments/*.js
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
      }
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
