# MyGovBC-MSP
![img](https://img.shields.io/badge/Lifecycle-Experimental-339999)
## General

This is MyGovBC-MSP, an Angular 6.x app. It provides the following processes:

1.  Enrolment Application
2.  Premium Assistance Application
3.  Account Change Application
4.  Supplementary Benefit Application
5.  Account Confirmation Letter (ACL) Request

## Table of contents

- [Browser Compatibility](#browser-compatibility)
- [Content Author Prerequisites](#content-author-prerequisites)
- [Content Authoring](#content-authoring)
- [Development Prerequisites](#development-prerequisites)
- [Development](#development)
- [Environments and Instance-Specific Configuration](#environments-and-instance-specific-configuration)
- [Unit Testing](#unit-testing)
- [Production](#production)
- [i18n and Markdown Support](#i18n-and-markdown-support)
- [XSD to Typescript Generation](#xsd-to-typescript-generation)
- [Contributing](#contributing)
- [License](#license)

## Browser Compatibility

- IE 11
- Edge (evergreen)
- Safari (evergreen)
- Chrome (evergreen)
- Firefox (evergreen)

Recommended minimum width of device: 320px

See `ACCESSIBILITY.md` for tested screen readers.

## Content Author Prerequisites

- A GitHub account with 2FA enabled.
- Write access to this repository.

## Content Authoring

Most of the application text is configurable. General procedure:

- Navigate to the test environment and view a screen
- Look at the URL of the page as this helps you find the right file to edit
- Browse to this repo's `/src/app/components/msp/` directory
- It should be apparent by the name of each directory which page you want to edit
- With pages with configurable content, you should see a 'i18n' directory
- Navigate into that directory to the './i18n/data/en/index.js' file
- You should see a list of variable names and values in single quotes
- Click the Edit button
- Using the editor, edit the value in between the single quotes
- If you need use a single quote, escape the quote with a backslash character \\
- You may not delete or add variables, ask a developer if you want to do that
- Once satisfied you can make a comment, e.g., content change, and commit the change
- After about 3-5 minutes the change will appear on the test web site
- If the change doesn't show up, it's likely the build failed because of a syntax issue, talk to a developer

#### Example

I want to edit the page `/msp/application/personal-info` and change the help block just below the title.

I navigate to:

[https://github.com/bcgov/MyGovBC-MSP/blob/master/src/app/components/msp/assistance/personal-info/i18n/data/en/index.js]()

I click the Edit button

I find in the file this line:

```
  helpBlock: 'Enter each person\'s legal name as it appears on their official Canadian identity documents, .e.g, birth' +
  ' certificate, permanent resident card, passport.',
```

I modified the text between the `'` on the right-hand side of the `:` and change it to my new text.

I make a comment in the Commit Changes that says 'content change' and click the `Commit changes` button.

After a make a few more edits, I double check my work at the test site.

## Development Prerequisites

- node@>=6.9.0
- npm@>=3.10.0
- AngularCLI (`npm install -g @angular/cli`) [Documentation](https://github.com/angular/angular-cli)

## Development

To launch dev instance

```bash
git clone https://github.com/bcgov/MyGovBC-MSP.git
cd MyGovBC-MSP
npm install
npm run dev
```

See `ACCESSIBILITY.md` for accessibility implementations patterns.

## Environments and Instance-Specific Configuration

MyGovBC-MSP uses the default AngularCLI approach to environments. [Documentation.](https://github.com/angular/angular-cli/wiki/build). Unlike the previous MyGovBC-MSP environment setup, now environment values do NOT cascade. There is no longer a global environment file. Instead, each environment file must be entirely self-contained and stand on its own.

In brief, `/src/environments/environment.ts` is for the dev environment, and `/src/environments/environment.prod.ts` is for prod. The default environment is dev. You define other environments in `.angular-cli.json` and you determine what environment to use via command line arguments.

```bash
ng serve -o # uses dev environment
ng serve -o --environment=prod # uses prod environment
ng build --prod # uses prod
ng build # uses dev.
ng serve -o --environment=example # uses example environment
```

To define a new environment, simply edit the `environments` property in .angular-cli.json to look like:

```json
"environments": {
  "dev": "environments/environment.ts",
  "prod": "environments/environment.prod.ts",
  "test": "environments/environment.test.ts",
  "local": "environments/environment.local.ts" //New environment
}
```

Then create the file, e.g. `src/environments/environment.local.ts`.

## Unit Testing

Unit testing is implemented using karma with Jasmine framework. The implementation generally follows [Angular webpack test configuration](https://angular.io/docs/ts/latest/guide/webpack.html#test-configuration). Jenkins CI runs unit tests as part of the build, therefore all unit test scripts should be able to run unattended, headless, quickly and depend only on local resources. Unit test scripts are located side-by-side with the target component and have file extension _.spec.js_ or _.spec.ts_. For an example of unit test script, see [/src/app/components/msp/landing/landing.spec.ts](https://github.com/bcgov/MyGovBC-MSP/blob/master/src/app/components/msp/landing/landing.spec.ts)

To start unit test manually, run `npm test`, which launches tests in headless PhantomJS browser. To run the unit tests in UI browser such as IE9, IE10, IE11, Firefox and Chrome, run `npm test -- --browsers Chrome`.

## Production

To build production distribution of the app,

```
npm run build
```

MSP production environment is hosted on OpenShift. Check out [deployment docs](openshift/app/README.md).

## i18n and Markdown Support

To facilitate building a multilingual site, i18n and markdown are supported by the webpack build framework. To promote modularization, there is no global folder to hold static content translations; instead, each Angular component can easily enable i18n and markdown static content editing feature by following 5 simple steps:

1. create folder _i18n_ under each component that needs i18n using a similar folder structure as _/src/app/components/msp/landing/i18n_
2. create static English content in _i18n/data/en_. You can use various formats:

- for short phrase type of content, create it in .js file in json format:

  ```
  // content of src/app/components/msp/landing/i18/data/en/index.js
  module.exports = {
    newApp: 'Start a New Application',
    pa: 'Apply for Premium Assistance',
    cn: 'Change Your Name'
  }
  ```

- for long content, create markdown or html files:

  ```
  [//]: # (content of src/app/components/msp/landing/i18/data/en/desc.md)
  # This is just a page for dev purposes to jump into these {page_count} flows:
  ```

  Notice there is a placeholder {page_count}. The delimiter {} is a matter of choice. We are going to substitute the placeholder later on.

3. (optional) translate the content into other languages under folder _i18n/data/\<lang\>_, preserving sub-folder structure. For example, French translation would be under _i18n/data/fr_.
4. Require _i18n_ folder in your component:

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

In the above example, language code _en_ is hard-coded. Depending on how do you capture user's language choice, be it implicitly from browser header detection or via URL path that user explicitly selected, the language code should be replaced with a variable.

Because the output of static content is string, you can implement placeholder in the static content and substitute them using _replace_ method as shown above for placeholder {page_count}.

The component _/src/app/components/msp/landing/_ has the reference implementation of i18n and markdown.

## XSD to Typescript Generation

### Tools

- Python 2.x (only used for npm dependencies native compiling)

### Windows Users

- Visual Studio Express 2015 with C++ compiler (only used for npm dependencies native compiling)

### CXSD

Install cxsd:

```
npm -g install cxsd
```

Running cxsd:

```
cxsd https://raw.githubusercontent.com/bcgov/MyGovBC-MSP/master/src/app/components/msp/api-model/xsd/ResponseTypes.xsd
```

## Contributing
Please see CONTRIBUTING.md for contributing guidelines

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
