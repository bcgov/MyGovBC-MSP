'use strict'
class MainController {

  constructor($http, appConstants, socket) {
    'ngInject'
    $http.get(appConstants.profileUrl).then(response => {
      this.profile = response.data
      try {
        socket.emit('info', 'hello')
      }
      catch (ex) {
      }
    })
  }
}

export default MainController
