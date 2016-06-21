'use strict';

import transactionsTpl from './transactions.html';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('transactions', {
      url: '/transactions',
      templateUrl: transactionsTpl,
      controller: require('./transactions.controller'),
      controllerAs: '$ctrl',
    });

}

export default routeConfig;
