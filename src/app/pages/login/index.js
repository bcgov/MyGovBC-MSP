'use strict';

import route from './route';

const loginPageModule = angular.module('transaction-module', [
  'ui.router',
  // core
  require("../../core/core.module").name
]);

loginPageModule
  .config(route);

export default loginPageModule;
