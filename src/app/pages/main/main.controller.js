'use strict';

function MainController($log, $scope, appConstants) {
  'ngInject';

  $log.debug('Hello from main controller!');
  $scope.appConstants = appConstants
  
}

export default MainController;
