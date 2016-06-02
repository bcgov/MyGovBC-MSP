'use strict'
+function () {
  angular.module('myBCGovApp')
    .component('review', {
      templateUrl: 'app/transcript/review.html',
      controller: function ($scope, transcriptService) {
        transcriptService.getTranscript(function(transcripts){
          $scope.transcript = transcripts[0]
        })
      }
    })
}()
