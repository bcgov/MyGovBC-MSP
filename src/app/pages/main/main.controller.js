'use strict';

module.exports = function ($http, appConstants, $window) {
  'ngInject';
  $http.get(appConstants.profileUrl).then(response => {
    this.profile = response.data;
    try{
      let socket = $window.io();
      socket.emit('message','hello');
    }
    catch(ex){}
  });
}

