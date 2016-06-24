'use strict'

export default function (app) {
  app.factory('socket', function($window){
    "ngInject"
    let socket
    try{
      socket = $window.io()
    }
    catch(ex){}
    return socket
  })
}
