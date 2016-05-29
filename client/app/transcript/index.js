'use strict'
+ function () {
  angular.module('myBCGovApp')
    .component('transcript', {
      templateUrl: 'app/transcript/index.html',
      controller: function ($scope, $resource, appConfig) {
        var PostSecondarySchool = $resource(appConfig.apis.transcript.url + '/postSecondarySchools', {}, {
          query: {
            method: "GET",
            isArray: true,
            withCredentials: true,
          }
        })
        PostSecondarySchool.query(function (schools) {
          $scope.postSecondarySchools = schools
        })
      }
    })
}()
