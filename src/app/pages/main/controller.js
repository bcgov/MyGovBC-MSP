'use strict'
class MainController {

  constructor($http, appConstants, $window) {
    'ngInject'
    $http.get(appConstants.profileUrl).then(response => {
      this.profile = response.data
      try {
        let socket = $window.io()
        socket.emit('info', 'hello')
      }
      catch (ex) {
      }
    })
  }
}

export default MainController
