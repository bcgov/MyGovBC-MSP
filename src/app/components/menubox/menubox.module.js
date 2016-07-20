'use strict';

import menuBoxDirective from './menubox.directive';

const menuBoxModule = angular.module('menubox-module', []);

menuBoxModule
  .directive('menubox', menuBoxDirective);

export default menuBoxModule;
