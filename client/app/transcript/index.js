'use strict'
+ function () {
  angular.module('myBCGovApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('transcript.review', {
          url: '/review',
          template: '<review></review>'
        })
    })
    .component('transcript', {
      templateUrl: 'app/transcript/index.html',
      controller: function ($scope, transcriptService) {
        $scope.dndMoved = function(list, $index){
          list.splice($index, 1)
          transcriptService.setSelectedSchools($scope.models.lists["Selected Institutions"])
        }
        transcriptService.getSchools(function (schools) {
          $scope.postSecondarySchools = schools
          $scope.models = {
            selected: null,
            lists: {"Available Institutions": [], "Selected Institutions": []}
          }
          $scope.models.lists["Available Institutions"] = schools
        })
      }
    })
}()
