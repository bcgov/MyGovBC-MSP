'use strict'

export default function (app) {
  app.factory('notificationService', function ($http, appConstants) {
    "ngInject"
    let _profile
    let promise = $http.get(appConstants.profileUrl).then(response => {
      _profile = response.data
    }, () => {
      _profile = null
    })
    return {
      promise: promise,
      set: function (profile) {
        _profile = profile
      },
      get: function () {
        return _profile
      }
    }
  })
}
