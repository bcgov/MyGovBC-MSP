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
  .config(function ($urlRouterProvider, $locationProvider, appConfig, $stateProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>'
      })
      .state('transcript', {
        url: '/transcript',
        template: '<transcript></transcript>'
      })
  });
