'use strict';

function MainController($log, $scope, appConfig) {
  'ngInject';

  $log.debug('Hello from main controller!');
  $scope.appConfig = appConfig
  
}

export default MainController;
