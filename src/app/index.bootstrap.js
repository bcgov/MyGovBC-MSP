'use strict';

// index.html page to dist folder
import '!!file-loader?name=[name].[ext]!../favicon.ico';

// main App module
import "./index.module";

import "./index.less";

angular.element(document).ready(function () {
  angular.bootstrap(document, ['myGov-core-client'], {
    strictDi: true
  });
});
