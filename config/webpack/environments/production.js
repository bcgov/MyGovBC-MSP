'use strict';
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function(_path) {
  return {
    context: _path,
    debug: true,
    devtool: 'cheap-source-map',
    output: {
      filename: '[name].[chunkhash].js'
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: _path,
        verbose: true,
        dry: false
      })
    ]
  };
};
