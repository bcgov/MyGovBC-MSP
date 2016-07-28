'use strict'

module.exports = function (notificationService, $scope) {
  'ngInject'
  notificationService.get(function (list) {
    $scope.notifications = list
  })
  $scope.deleteItem = function (index) {
    let list = $scope.notifications
    notificationService.delete(list[index].baseUrl + '/' + list[index].id, function (err, data) {
      list.splice(index, 1)
    })
  }
}

