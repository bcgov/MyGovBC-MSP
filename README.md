# myGov-core-client
This is myGov client-side core AngularJS app. It is scaffolded using [angular-webpack-es6](https://github.com/stukh/generator-angular-webpack-es6) yeoman generator with following webpack customizations:

1. Support less
2. Support instance specific config in file `/config/webpack/environments/local.js`. The file is ignored by git. The file should return a factory function similar to its siblings.
3. Inject application constants from webpack config `appConstants` object merged from different environments. See `/config/webpack/global.js` for default.

## Development
It is recommended to install the app under `/client` folder of [myGov-core-server](https://github.com/f-w/myGov-core-server). 

To launch dev instance, assuming cwd is `/` of `myGov-core-server`:
```
git clone https://github.com/f-w/myGov-core-client client
cd client
npm install
npm run dev
```
## Production
```
npm run build
```
