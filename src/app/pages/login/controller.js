'use strict'
class LoginController {

  constructor($cookies, $scope) {
    'ngInject'
    $scope.sid = $cookies.get('connect.sid') || 'unknown'
  }
}

export default LoginController
