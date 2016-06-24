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
      resolve:{
        profileServiceData: function(profileService){
          'ngInject'
          return profileService.promise
        }
      }
    });

}

export default routeConfig;
