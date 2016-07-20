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
      ncyBreadcrumb: {
        parent: 'main',
        label: 'My Transactions'
      }
    });

}

export default routeConfig;
