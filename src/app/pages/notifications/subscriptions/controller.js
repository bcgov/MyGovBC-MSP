'use strict'
module.exports = function (notificationSubscriptionService, $scope) {
  'ngInject'
  notificationSubscriptionService.get(function (err, data) {
    $scope.serviceSubscriptions = data
  })
  $scope.onSubmit = function () {
    notificationSubscriptionService.update($scope.serviceSubscriptions, function (err, res) {
      // TODO: check err and res before showing confirmation dialog
      $scope.confirmationData = res
      $('#mygovConfirmationModal').modal('show')
    })
  }
  $scope.onSendConfirmationCodes = function () {
    notificationSubscriptionService.confirm($scope.confirmationData, $scope.serviceSubscriptions, function (err, res) {
      $('#mygovConfirmationModal').modal('hide')
    })
  }
  $scope.updateField = function (data) {
    if (data.channelId !== data.previousChannelId) {
      data.state = 'unconfirmed'
    }
  }
  $scope.onTelChange = function (evt) {
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

