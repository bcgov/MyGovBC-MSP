'use strict'

import route from './route'
require('script!qrcode-generator')
require('script!qrcode-generator/js/qrcode_UTF8')
require("script!angular-qrcode")

const loginPageModule = angular.module('login-module', [
  'ui.router',
  require("../../core/core.module").name,
  'monospaced.qrcode'
])

loginPageModule
  .config(route)

export default loginPageModule
