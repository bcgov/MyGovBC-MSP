'use strict';

angular.module('myBCGovApp')
  .config(function ($stateProvider, appConfig) {
    $stateProvider
      .state('main', {
        url: appConfig.rootUrlPath || '/',
        template: '<main></main>'
      });
  });
