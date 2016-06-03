'use strict'
+ function () {
  angular.module('myBCGovApp')
    .factory('transcriptService', function ($resource, appConfig) {
      var TranscriptService = {}
      TranscriptService.selectedSchools = {}
      TranscriptService.getSchools = function (cb) {
        var PostSecondarySchool = $resource(appConfig.apis.transcript.url + '/postSecondarySchools')
        PostSecondarySchool.query(function (schools) {
          cb(schools)
        })
      }
      TranscriptService.getTranscript = function (cb) {
        var MyTranscript = $resource(appConfig.apis.transcript.url + '/transcripts')
        MyTranscript.query(function (data) {
          cb(data)
        })
      }
      TranscriptService.getSelectedSchools = function (cb) {
        cb(TranscriptService.selectedSchools)
      }
      TranscriptService.setSelectedSchools = function (schools) {
        TranscriptService.selectedSchools = schools
      }
      return TranscriptService
    })
}()
