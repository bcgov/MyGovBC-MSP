'use strict'
module.exports = function (notificationSubscriptionService, $scope) {
  'ngInject'
  notificationSubscriptionService.get(function (err, data) {
    console.log(data)
    $scope.serviceSubscriptions = data
  })
  $scope.onSubmit = function () {
    notificationSubscriptionService.update($scope.serviceSubscriptions, function (err, res) {

    })
  }
  $scope.onChange = function (evt) {
    switch (evt.target.value.length) {
      case 3:
        evt.target.value += '-'
        break
      case 7:
        evt.target.value += '-'
        break
      default:
    }
    if (evt.target.value.length > 11) {
      evt.preventDefault()
      return false
    }
  }
}

