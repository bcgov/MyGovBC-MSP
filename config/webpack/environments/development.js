'use strict';
var webpack = require('webpack');

module.exports = function(_path) {
  return {
    context: _path,
    // debug: true,
    devtool: 'inline-source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  };
};
