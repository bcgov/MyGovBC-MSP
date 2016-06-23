'use strict';

import route from './route';
import './index.less'

const mainPageModule = angular.module('main-module', [
  'ui.router',
  // core
  require("../../core/core.module").name
]);

mainPageModule
    .config(route);

export default mainPageModule;
