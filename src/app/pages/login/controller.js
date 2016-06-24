'use strict'
class LoginController {

  constructor($cookies, $scope, socket) {
    'ngInject'
    $scope.sid = $cookies.get('connect.sid') || 'unknown'
    socket.on('auth', function(data){
      console.log(data.name)
    })
  }
}

export default LoginController
