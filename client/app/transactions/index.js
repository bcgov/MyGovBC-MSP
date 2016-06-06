'use strict'
+ function () {
  angular.module('myBCGovApp')
    .config(function ($stateProvider) {

    })
    .component('transactions', {
      templateUrl: 'app/transactions/index.html',
      controller: function ($scope, transcriptService) {
        transcriptService.getTranscriptSubmissions(function (transcriptSubmissions) {
          $scope.transcriptSubmissions = transcriptSubmissions;
        })
      }
    })
}()
