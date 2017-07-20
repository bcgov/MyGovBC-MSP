'use strict';
var webpack = require('webpack');

module.exports = function (_path) {
  return {
    context: _path,
    resolve: {
      unsafeCache: true
    },
    devtool: 'cheap-module-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        warnings: false,
        sourceMap: true
      })
    ],
    devServer: {
      publicPath: '/msp',
      contentBase: './dist',
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
      },
      stats: {
        children: false, //Hides extractTextPlugin spam to stdout
        colors: true,
        errors: true,
        warnings: true,
      }
    }
  };
};
