# myGov-core-client
This is myGov client-side core AngularJS app. It is scaffolded using [angular-webpack-es6](https://github.com/stukh/generator-angular-webpack-es6) yeoman generator with following webpack customizations:

1. Support less
2. Support instance specific config in file `/config/webpack/environments/local.js`. The file is ignored by git. The file should return a factory function similar to its siblings.
3. Inject application constants from webpack config `appConstants` object merged from different environments. See `/config/webpack/global.js` for default.

## Browser Compatibility

* IE 9+
* Edge 
* Safari (TBD)
* Chrome (evergreen)
* Firefox (evergreen)

## Developer Prerequisites
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

## Unit Testing 
For unit testing you'll need to install the karma CLI
```
npm install -g karma-cli
```

We run unit tests on IE9, IE10, IE11, Firefox and Chrome.  You'll need IE11, Firefox and Chrome installed.

To continuously run Jasmine tests with the Karma load runner (in chrome) use:
```
karma start
```

## Configuring Widget
Download package via NPM:

```
npm install <URL or package name> --save-dev
```

It is recommended for **test** and **production** scenarios to specify a version number (as a GIT tag) in the URL.  

```
npm install <URL#0.1.0> --save-dev
npm install <name@0.1.x> --save-dev
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

IMPORTANT: Once AngularJS knows about your widget its time to add it to our mygov service registry.  
This lets the client to show it on the main page for users and dynamically route to it.  
Eventually we'll have a UI but for now, see README.md in `mygov-core-server`.

## Production
```
npm run build
```

## For Core Development

If you're a widget developer you can skip this section.  This section is for core developers.
 
### Generating AngularJS Service for SLC Loopback

The `mygov-core-server` uses slc loopback.  So we can conviently use the [Loopback AngularJS SDK](https://docs.strongloop.com/display/APIC/AngularJS+JavaScript+SDK) to generate our AngularJS Services.
 
When you make a change to a model/API on the `mygov-core-server`, you'll need to update our client side code by running:

```
cd <path to>\mygov-core-client\
lb-ng <path to>\mygov-core-server\server\server.js src\app\core\services\lb-services.js
```

## License

    Copyright 2016 Province of British Columbia

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at 

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
