'use strict'
+function () {
  angular.module('myBCGovApp')
    .component('review', {
      templateUrl: 'app/transcript/review.html',
      controller: function ($scope, transcriptService) {
        var ctrl = this;

        transcriptService.getSelectedSchools(function(schools) {
          $scope.selectedSchools = schools;
        })
        transcriptService.getTranscript(function(transcripts){
          $scope.transcript = transcripts[0]
        })

        // Action for confirm and send button
        ctrl.confirmAndSend = function () {
          // TODO, call service
        }
      }

    })
}()
