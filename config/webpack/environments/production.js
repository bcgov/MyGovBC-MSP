'use strict';
var CleanWebpackPlugin = require('clean-webpack-plugin');

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
