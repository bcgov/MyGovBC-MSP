'use strict'
module.exports = function (notificationSubscriptionService, $scope) {
  'ngInject'
  notificationSubscriptionService.get(function (err, data) {
    console.log(data)
    $scope.serviceSubscriptions = data
  })
}

