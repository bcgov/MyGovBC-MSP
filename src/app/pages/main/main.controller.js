'use strict';

module.exports = function ($http, appConstants, $window) {
  'ngInject';
  $http.get(appConstants.profileUrl).then(response => {
    this.profile = response.data;
  });
}

