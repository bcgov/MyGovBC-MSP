'use strict'
/*eslint no-console:0 */
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
var open = require('open')

new WebpackDevServer(webpack(config), config.devServer)
    .listen(config.devServer.port, "localhost", function (err) {
        let URL = "http://localhost:" + config.devServer.port + config.devServer.publicPath;
        console.log("Starting server on: " + URL);
        if (err) {
            console.error("ERRROR!", err);
        }
        open(URL);
    });