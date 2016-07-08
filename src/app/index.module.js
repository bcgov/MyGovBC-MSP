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
    "lbServices",

    // core
    require("./core/core.module").name,

    // components
    require("./index.components").name,

    // routes
    require("./index.routes").name,

    // pages
    require("./pages/main").name,
    require("./pages/transactions").name,
    require("./pages/login").name,

    // widget add-ons
    require("mygov-widget-education").name,
    require("mygov-widget-resizable-iframe").name
  ]
);

App
  .config(config)
  .run(run);


export default App;
