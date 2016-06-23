'use strict';

module.exports = function ($scope, $http, appConstants, $window, transcriptService) {
  'ngInject';
  transcriptService.getTranscriptSubmissions(function (transcriptSubmissions) {
    $scope.transcriptSubmissions = transcriptSubmissions;
  })
}

