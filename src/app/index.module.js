'use strict';

import * as components from './index.components';
import config from './index.config';
import run from './index.run';


const App = angular.module(
  "myGov-core-client", [
    // plugins
    require('angular-ui-router'),
    "ngAnimate",
    "ngCookies",
    "ngTouch",
    "ngSanitize",
    "ngMessages",
    "ngAria",
    "ngResource",
    
    // core
    require("./core/core.module").name,

    // components
    require("./index.components").name,

    // routes
    require("./index.routes").name,

    // pages
    require("./pages/main/main.module").name,
    require("./pages/transactions/transactions.module").name,

    // widget add-ons
    "mygov.widget.education.integrated"
  ]
);

App
  .config(config)
  .run(run);


export default App;
