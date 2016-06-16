'use strict'

angular.module('myBCGovApp', [
  'myBCGovApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'dndLists',
  'mygov.widget.education.integrated'
])
  .config(function ($urlRouterProvider, $locationProvider, appConfig, $stateProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true
    $urlRouterProvider
      .otherwise('/')
    $locationProvider.html5Mode(true)
    $stateProvider
      .state('main', {
        url: '/',
        template: '<main></main>'
      })
      .state('education', {
        url: '/education',
        template: '<education></education>'
      })
      .state('transactions', {
        url: '/transactions',
        template: '<transactions></transactions>'
      })
  })
