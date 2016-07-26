'use strict';

function routeConfig($stateProvider) {
  'ngInject';
  $stateProvider
    .state('notifications', {
      url: '/notifications',
      templateUrl: require('./index.html'),
      controller: require('./controller'),
      controllerAs: '$ctrl',
      ncyBreadcrumb: {
        parent: 'main',
        label: 'My Notifications'
      }
    });

}

export default routeConfig;
