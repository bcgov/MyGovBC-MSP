'use strict'
import parallel from 'async/parallel'

module.exports = function (notificationService, $scope, $timeout, $rootScope) {
  'ngInject'
  let markReadPromise, timeOutReached = false
  notificationService.get(function (err, list) {
    $scope.notifications = list
    markReadPromise = $timeout(function () {
      timeOutReached = true
    }, 10000)
  })
  $scope.deleteItem = function (index) {
    let list = $scope.notifications
    notificationService.delete(list[index].baseUrl + '/' + list[index].id, function (err, data) {
      list.splice(index, 1)
    })
  }
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $timeout.cancel(markReadPromise)
    if(!timeOutReached) return
    try {
      let markAsReadRequests = $scope.notifications.filter(function (e, i) {
        return e.state === 'new'
      }).reduce(function (p, e, i) {
        p.push(function (cb) {
          notificationService.markAsRead(e.baseUrl + '/' + e.id, function (err, data) {
            err || (e.state = 'read')
            cb(err, data)
          })
        })
        return p
      }, [])
      parallel(markAsReadRequests, function(err, data){
        $rootScope.$broadcast('unreadCountChanged')
      })
    }
    catch (ex) {
    }
  })
}

