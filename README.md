# MyGovBC-core-client
This is MyGovBC client-side core AngularJS app. It is scaffolded using [angular-webpack-es6](https://github.com/stukh/generator-angular-webpack-es6) yeoman generator with following webpack customizations:

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
* npm@>=3.10.0 (note: not the default of node@4.2.5)

## Development
It is recommended to install the app under `/client` folder of [MyGovBC-core-server](https://github.com/bcgov/MyGovBC-core-server).

To launch dev instance, assuming cwd is `/` of `MyGovBC-core-server`:
```
git clone https://github.com/bcgov/MyGovBC-core-client client
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

To continuously run Jasmine tests with the Karma load runner (in Chrome only) use:
```
karma start --browsers Chrome
```

To continuously run Jasmine tests with the Karma load runner (ALL Browsers) use:
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
  "MyGovBC-core-client", [
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
    require("../../node_modules/MyGovBC-widget-education").name
  ]
);
```

IMPORTANT: Once AngularJS knows about your widget its time to add it to our MyGovBC service registry.  
This lets the client to show it on the main page for users and dynamically route to it.  
Eventually we'll have a UI but for now, see README.md in `MyGovBC-core-server`.

## Developing Widget in MyGovBC-core-client
In order to build, test and view a widget, it requires the MyGovBC-core-client.

One would expect you could do this with a `npm link`, but there's an existing defect in WebPack and Babel which
makes this impossible (for now...).  We have this workaround:

You'll need to checkout a GIT repo under the `node_modules` directory.  NPM doesn't like this an will throw errors 
during any `npm install`.  Just ignore these.

To make it easier to work with the repo in an IDE, create a junction next to of mygovbcc-core-client
 (like a symlink for a directory)

```
mklink /J mygovbc-widget-sharedservices-foodsafe mygov-core-client\node_modules\mygovbc-widget-sharedservices-foodsafe
```

## Production
```
npm run build
```

## For Core Development

If you're a widget developer you can skip this section.  This section is for core developers.
 
### Generating AngularJS Service for SLC Loopback

The `MyGovBC-core-server` uses slc loopback.  So we can conviently use the [Loopback AngularJS SDK](https://docs.strongloop.com/display/APIC/AngularJS+JavaScript+SDK) to generate our AngularJS Services.
 
When you make a change to a model/API on the `MyGovBC-core-server`, you'll need to update our client side code by running:

```
cd <path to>\MyGovBC-core-client\
lb-ng <path to>\MyGovBC-core-server\server\server.js src\app\core\services\lb-services.js
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
