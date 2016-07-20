'use strict';

function config($urlRouterProvider, $locationProvider, appConstants, $stateProvider, $httpProvider,
                LoopBackResourceProvider, $breadcrumbProvider) {
  'ngInject';
  $httpProvider.defaults.withCredentials = true;
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
  LoopBackResourceProvider.setUrlBase(appConstants.loopbackBaseUrl);
  $breadcrumbProvider.setOptions({
    prefixStateName: 'main',
    template: 'bootstrap3'
  });
}

export default config;
