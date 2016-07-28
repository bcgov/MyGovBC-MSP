'use strict'

module.exports = function (notificationService, $scope) {
  'ngInject'
  notificationService.get(function(list){
    $scope.notifications = list
  })
}

