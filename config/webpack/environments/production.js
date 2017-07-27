'use strict';
var CleanWebpackPlugin = require('clean-webpack-plugin');
var webpack = require('webpack');

module.exports = function(_path) {
  return {
    context: _path,
    devtool: 'cheap-source-map',
    output: {
      filename: '[name].[chunkhash].js'
    },
    plugins: [
      new CleanWebpackPlugin(['dist'], {
        root: _path,
        verbose: true,
        dry: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        warnings: false,
        sourceMap: false
      }),
      function()
      {
        this.plugin("done", function(stats)
        {
          if (stats.compilation.errors && stats.compilation.errors.length)
          {
            console.log(stats.compilation.errors);
            process.exit(1);
          }
          // ...
        });
      }
    ]
  };
};
