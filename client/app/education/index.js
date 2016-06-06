'use strict'
+ function () {
  angular.module('myBCGovApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('transcript.index', {
          url: '/transcript',
          template: '<transcript></transcript>'
        })
    })
    .component('education', {
      templateUrl: 'app/education/index.html',
      controller: function ($scope) {

      }
    })
}()
