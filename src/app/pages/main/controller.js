'use strict';
class MainController {

  constructor($scope, profileService, socket, Service, notificationService) {
    'ngInject';
    $scope.today = new Date();
    this.profile = profileService.get();
    Service.find({}, function (list) {
        $scope.service = list
      },
      function (errorResponse) {
        //TODO: handle it
      }
    )
    $scope.$on('unreadCountChanged', function(event){
      notificationService.getUnreadCount(function(err, num){
        $scope.unreadMsgCount = num
      })
    })

    $scope.pluralize = require('pluralize')
    notificationService.getUnreadCount(function(err, num){
      $scope.unreadMsgCount = num
    })
    try {
      socket.emit('info', 'hello')
    }
    catch (ex) {
    }
  }
}

export default MainController
