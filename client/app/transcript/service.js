'use strict'
+ function () {
  angular.module('myBCGovApp')
    .factory('transcriptService', function ($resource, $q, appConfig) {
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
      TranscriptService.submitTranscripts = function (cb) {
        var promises = [];

        angular.forEach(TranscriptService.selectedSchools, function (school, key) {
          var TranscriptSubmission = $resource(appConfig.apis.transcript.url + '/transcriptSubmissions', {}, {
            save: {
              method: 'POST',
              headers: {
                'Content-Type': 'text/plain'
              }
            }
          })
          var body = {
            'schoolID': school.id,
            'submissionDate': Date.now(),
            'userID': '123'
          }
          promises.push(TranscriptSubmission.save({}, body))
        })

        // Wait for all to finish before calling back
        $q.all(promises).then(cb())
      }

      TranscriptService.getTranscriptSubmissions = function (cb) {
        var TranscriptSubmissions = $resource(appConfig.apis.transcript.url + '/transcriptSubmissions')
        TranscriptSubmissions.query(function (data) {
          cb(data)
        })
      }
      return TranscriptService
    })
}()
