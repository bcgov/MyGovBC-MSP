'use strict';

import route from './transactions.route';
import './transactions.less'

const transactionsPageModule = angular.module('transaction-module', [
  'ui.router',
  // core
  require("../../core/core.module").name
]);

transactionsPageModule
    .config(route);

export default transactionsPageModule;
