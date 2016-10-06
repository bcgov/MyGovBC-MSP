'use strict'

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico'

// main App module
import "./index.module.js"

import "./index.less"

import {upgradeAdapter} from './upgrade_adapter'

angular.element(document).ready(function () {
  upgradeAdapter.bootstrap(document.body, ['myGov-core-client'], {
    strictDi: true
  })
})
