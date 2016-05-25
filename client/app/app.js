'use strict';

angular.module('myBCGovApp', [
  'myBCGovApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'
])
  .config(function ($urlRouterProvider, $locationProvider, appConfig) {
    $urlRouterProvider
      .otherwise(appConfig.rootUrlPath || '/');

    $locationProvider.html5Mode(true);
  });
