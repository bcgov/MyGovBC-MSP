+ function () {
  angular.module('myBCGovApp')
    .config(function ($stateProvider){
      $stateProvider
        .state('transcript.review', {
          url: '/review',
          template: '<review></review>'
        })
    })
    .component('transcript', {
      templateUrl: 'app/transcript/index.html',
      controller: function ($scope, $resource, appConfig) {
        var PostSecondarySchool = $resource(appConfig.apis.transcript.url + '/postSecondarySchools')
        PostSecondarySchool.query(function (schools) {
          $scope.postSecondarySchools = schools
          $scope.models = {
            selected: null,
            lists: {"Available Institutions": [], "Selected Institutions": []}
          };
          $scope.models.lists["Available Institutions"] = schools;
        })
      }
    })
}()
