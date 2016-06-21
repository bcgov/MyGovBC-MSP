'use strict';

function config($urlRouterProvider, $locationProvider, appConstants, $stateProvider, $httpProvider) {
    'ngInject';
    $httpProvider.defaults.withCredentials = true
    $urlRouterProvider
        .otherwise('/')
    $locationProvider.html5Mode(true)
   
}

export default config;
