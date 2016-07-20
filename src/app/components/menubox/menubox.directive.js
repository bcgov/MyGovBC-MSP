'use strict';

import menuBoxTpl from './menubox.html';

function menuBoxComponent($log) {
	'ngInject';

  var directive = {
    restrict: 'E',
    templateUrl: menuBoxTpl,
    controller: MenuBoxController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function MenuBoxController () {
  }

}

export default menuBoxComponent;
