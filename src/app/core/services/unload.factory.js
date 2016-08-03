'use strict'
export default function (app) {
  app.factory('beforeUnload', function ($rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle

    $window.onbeforeunload = function (e) {
      var confirmation = {}
      var event = $rootScope.$broadcast('onBeforeUnload', confirmation)
      if (event.defaultPrevented) {
        return confirmation.message
      }
    }
    return {}
  }).run(function (beforeUnload) {
    // Must invoke the service at least once
  })
}
