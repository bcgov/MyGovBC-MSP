'use strict'

// Depends
var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var NODE_ENV = process.env.NODE_ENV || "production"
var DEVELOPMENT = NODE_ENV === "production" ? false : true
var stylesLoader = 'css-loader?sourceMap!postcss-loader!sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true'


module.exports = function (_path) {
  var rootAssetPath = _path + 'src'

  var webpackConfig = {
    // entry points
    entry: [_path + '/src/polyfills', _path + '/src/vendor', _path + '/src/main'],

    // output system
    output: {
      path: require("path").resolve("dist"),
      filename: '[name].js',
      publicPath: '/msp',
    },

    // resolves modules
    resolve: {
      extensions: ['', '.js', '.ts'],
      modulesDirectories: ['node_modules'],
      alias: {
        _appRoot: path.join(_path, 'src', 'app'),
        _images: path.join(_path, 'src', 'app', 'assets', 'images'),
        _stylesheets: path.join(_path, 'src', 'app', 'assets', 'styles'),
        _scripts: path.join(_path, 'src', 'app', 'assets', 'js')
      }
    },

    // modules resolvers
    module: {
      noParse: [],
      loaders: [
        {
          test: /\.ts$/,
          loaders: ['awesome-typescript-loader', 'angular2-template-loader']
        },
        {
          test: /\.html$/,
          loaders: [
            'html'
          ]
        },
        {test: /\.md$/, loader: "html!markdown"},
        {
          test: /\.css$/,
          loader: DEVELOPMENT ? 'style!css?sourceMap!postcss' : ExtractTextPlugin.extract("style",
            'css?sourceMap!postcss')
        }, {
          test: /\.less$/,
          loader: DEVELOPMENT ? "style!css!postcss!less" : ExtractTextPlugin.extract("style", "css!postcss!less")
        }, {
          test: /\.(scss|sass)$/,
          loader: DEVELOPMENT ? ('style!' + stylesLoader) : ExtractTextPlugin.extract('style', stylesLoader)
        }, {
          test: /\.(woff2|woff|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loaders: [
            "url-loader?name=assets/fonts/[name]_[hash].[ext]"
          ]
        }, {
          test: /\.(jpe?g|png|gif)$/i,
          loaders: [
            'url-loader?name=assets/images/[name]_[hash].[ext]&limit=10000'
          ]
        }, {
          test: require.resolve("jquery"),
          loaders: [
            "expose?$",
            "expose?jQuery"
          ]
        }
      ]
    },

    // post css
    postcss: [autoprefixer({browsers: ['last 5 versions']})],

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
      new ExtractTextPlugin('assets/styles/css/[name]' + (NODE_ENV === 'development' ? '' : '.[chunkhash]') + '.css', {allChunks: true})
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
        acceptMimeType: "image/*",
        convertToMimeType: "image/jpeg",
        jpegQuality: 0.5
      }
    },
    htmlLoader: {
      minimize: false,
    }
  }
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
