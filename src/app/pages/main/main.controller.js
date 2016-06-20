'use strict';
class MainController {

  constructor($http, $scope, appConstants) {
    'ngInject';
    this.$http = $http;
    this.appConstants = appConstants
  }

  $onInit() {
    this.$http.get(this.appConstants.profileUrl).then(response => {
      this.profile = response.data;
    });
  }
}


export default MainController;
