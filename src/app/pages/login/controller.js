'use strict'
class LoginController {

  constructor($cookies, $scope, socket, profileService, $location) {
    'ngInject'
    $scope.sid = $cookies.get('connect.sid') || 'unknown'
    socket.on('auth', function(data){
      let _ = require('lodash')
      let profile = profileService.get()
      _.merge(profile, data)
      profileService.set(profile)
      console.log(data.name)
      $location.url('../')
    })
  }
}

export default LoginController
