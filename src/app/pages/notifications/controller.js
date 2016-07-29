'use strict'
import parallel from 'async/parallel'

module.exports = function (notificationService, $scope, $timeout) {
  'ngInject'
  notificationService.get(function (list) {
    $scope.notifications = list
    $timeout(function () {
      try {
        let markAsReadRequests = list.filter(function (e, i) {
          return e.state === 'new'
        }).reduce(function (p, e, i) {
          p.push(function (cb) {
            notificationService.markAsRead(e.baseUrl + '/' + e.id)
          })
          return p
        }, [])
        parallel(markAsReadRequests)
      }
      catch (ex) {
      }
    }, 10000)
  })
  $scope.deleteItem = function (index) {
    let list = $scope.notifications
    notificationService.delete(list[index].baseUrl + '/' + list[index].id, function (err, data) {
      list.splice(index, 1)
    })
  }
}

