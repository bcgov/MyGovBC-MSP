'use strict'

function routeConfig($stateProvider) {
  'ngInject'
  $stateProvider
    .state('notificationSubscriptions', {
      url: '/notifications/subscriptions',
      templateUrl: require('./index.html'),
      controller: require('./controller'),
      controllerAs: '$ctrl',
      ncyBreadcrumb: {
        parent: 'main',
        label: 'Notification Subscriptions'
      }
    })

}
export default routeConfig
