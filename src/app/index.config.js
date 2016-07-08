'use strict';

function config($urlRouterProvider, $locationProvider, appConstants, $stateProvider, $httpProvider, LoopBackResourceProvider) {
  'ngInject';
  $httpProvider.defaults.withCredentials = true
  $urlRouterProvider
    .otherwise('/')
  $locationProvider.html5Mode(true)
  LoopBackResourceProvider.setUrlBase(appConstants.loopbackBaseUrl)
}

export default config;
