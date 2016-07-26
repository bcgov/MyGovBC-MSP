'use strict';

import route from './route';
import './index.less'

export default  angular.module('notification-module', [
  'ui.router',
  // core
  require("../../core/core.module").name
]).config(route);
