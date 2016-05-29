'use strict'
+ function () {
  angular.module('myBCGovApp')
    .component('transcript', {
      templateUrl: 'app/transcript/index.html',
      controller: function ($scope, $resource, appConfig) {
        var PostSecondarySchool = $resource(appConfig.apis.transcript.url + '/postSecondarySchools')
        PostSecondarySchool.query(function (schools) {
          $scope.postSecondarySchools = schools
        })
      }
    })
}()
