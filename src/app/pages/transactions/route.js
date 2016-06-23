'use strict';

import transactionsTpl from './index.html';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('transactions', {
      url: '/transactions',
      templateUrl: transactionsTpl,
      controller: require('./controller'),
      controllerAs: '$ctrl',
    });

}

export default routeConfig;
