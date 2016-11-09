# MyGovBC-MSP
This is MyGovBC MSP AngularJS 2.x app.  It provides the following processes:
 1. MSP Application
 2. Premium Assistance Application
 3. Name Change

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

## Production
```
npm run build
```

## i18n and Markdown Support
To facilitate building a multilingual site, i18n and markdown are supported by the webpack build framework. To promote modularization, there is no global folder to hold static content translations; instead, each Angular component can easily enable i18n and markdown static content editing feature by following 5 simple steps:

1. create folder *i18n* under each component that needs i18n using a similar folder structure as */src/app/components/msp/landing/i18n*
2. create static English content in *i18n/data/en*. You can use various formats:
  * for short phrase type of content, create it in .js file in json format:
  
    ```
    // content of src/app/components/msp/landing/i18/data/en/index.js
    module.exports = {
      newApp: 'Start a New Application',
      pa: 'Apply for Premium Assistance',
      cn: 'Change Your Name'
    }
    ```
  * for long content, create markdown or html files:
  
    ```
    [//]: # (content of src/app/components/msp/landing/i18/data/en/desc.md)
    # This is just a page for dev purposes to jump into these {page_count} flows:
    ```
3. (optional) translate the content into other languages under folder *i18n/data/\<lang\>*, preserving sub-folder structure. For example, French translation would be under *i18n/data/fr*.
4. Require *i18n* folder in your component:

  ```
  export class MyComponent {
    ...
    lang = require('./i18n')
  }
  ```
5. Use the translated static content in your HTML template:

  ```
   {{lang('./en/index').newApp}}
   <div [innerHTML]="lang('./en/desc.md').replace('{page_count}',3)"></div>
  ```
  
  in the above example, language code *en* is hard-coded. Depending on how do you capture user's language choice, be it implicitly from browser header detection or via URL path that user explicitly selected, the language code should be replaced with a variable.
  
  Because the output of static content is string, you can implement placeholder in the static content and substitute them with Angular variables easily as shown above for placeholder {page_count}.
  
The component */src/app/components/msp/landing/* has the reference implementation of i18n and markdown.

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
