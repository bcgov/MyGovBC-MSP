'use strict'
class MainController {

  constructor(profileService, socket) {
    'ngInject'
    this.profile = profileService.get()
    try {
      socket.emit('info', 'hello')
    }
    catch (ex) {
    }
  }
}

export default MainController
