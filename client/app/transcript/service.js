'use strict'
+ function () {
  angular.module('myBCGovApp')
    .factory('transcriptService', function ($resource, appConfig) {
      var School = {}
      School.selectedSchools = {}
      School.getSchools = function (cb) {
        var PostSecondarySchool = $resource(appConfig.apis.transcript.url + '/postSecondarySchools')
        PostSecondarySchool.query(function (schools) {
          cb(schools)
        })
      }
      School.getSelectedSchools = function () {
        return School.selectedSchools
      }
      School.setSelectedSchools = function (schools) {
        School.selectedSchools = schools
      }
      return School
    })
}()
