'use strict';

import mainTpl from './index.html';

function routeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: mainTpl,
      controller: require('./controller'),
      controllerAs: '$ctrl',
    });

}

export default routeConfig;
