'use strict'

import html from './index.html'

function routeConfig($stateProvider) {
  'ngInject'

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: html,
      controller: require('./controller'),
      controllerAs: '$ctrl',
    })
}

export default routeConfig
