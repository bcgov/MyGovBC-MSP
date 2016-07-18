'use strict'

import route from './route'

const stylesPageModule = angular.module('dev-module', [
  'ui.router',
  require("../../../core/core.module").name
])

stylesPageModule
  .config(route)

export default stylesPageModule
