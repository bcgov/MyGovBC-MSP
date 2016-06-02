'use strict'
+function () {
  angular.module('myBCGovApp')
    .component('review', {
      templateUrl: 'app/transcript/review.html',
      controller: function ($scope, transcriptService) {
        console.log(transcriptService.getSelectedSchools())
      }
    })
}()
