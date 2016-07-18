'use strict'

import html from './index.html'

function routeConfig($stateProvider) {
  'ngInject'

  $stateProvider
    .state('devStyles', {
      url: '/dev/styles',
      templateUrl: html,
      controller: require('./controller'),
      controllerAs: '$ctrl',
    })
}

export default routeConfig
