'use strict'
/*eslint no-console:0 */
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
var open = require('open')


//ARC TODO - Handle the below. Delete + add functionatlity to npm scripts?
// console.log('WebpackDevServer: ', config.devServer)

// new WebpackDevServer(webpack(config), config.devServer)
//   .listen(config.port, 'localhost', function (err) {
//     if (err) {
//       console.log(err)
//     }
//     console.log('Listening at localhost:' + config.port)
//     console.log('Opening your system browser...')
//     open('http://localhost:' + config.port + config.devServer.publicPath)
//   })
