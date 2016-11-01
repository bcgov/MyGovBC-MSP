import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'
import {enableProdMode} from '@angular/core'
import {AppModule} from './app/app.module'
import 'file?name=[name].[ext]!./favicon.ico'
let appConstants = require('./app/services/appConstants')
if (appConstants.default.runtimeEnv === 'production') {
  enableProdMode()
}
platformBrowserDynamic().bootstrapModule(AppModule)
