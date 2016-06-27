# myGov-core-client
This is myGov client-side core AngularJS app. It is scaffolded using [angular-webpack-es6](https://github.com/stukh/generator-angular-webpack-es6) yeoman generator with following webpack customizations:

1. Support less
2. Support instance specific config in file `/config/webpack/environments/local.js`. The file is ignored by git. The file should return a factory function similar to its siblings.
3. Inject application constants from webpack config `appConstants` object merged from different environments. See `/config/webpack/global.js` for default.

## Prerequisites
* node@>=4.2.5
* npm@>=3.10.0

## Development
It is recommended to install the app under `/client` folder of [myGov-core-server](https://github.com/f-w/myGov-core-server).

To launch dev instance, assuming cwd is `/` of `myGov-core-server`:
```
git clone https://github.com/f-w/myGov-core-client client
cd client
npm install
npm run dev
```
## Configuring Widget
Download package via NPM:

```
npm install <URL or package name> --save-dev
```

Edit ```index.module.js```, e.g.,:

```
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
    require("../../node_modules/mygov-widget-education").name
  ]
);
```

## Production
```
npm run build
```
