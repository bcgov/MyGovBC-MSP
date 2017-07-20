import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'
import {enableProdMode} from '@angular/core'
import {AppModule} from './app/app.module'
import 'file-loader?name=[name].[ext]!./favicon.ico'
import 'file-loader?name=[name].[ext]!./robots.txt'
let appConstants = require('./app/services/appConstants')
if (appConstants.default.runtimeEnv === 'production') {
  enableProdMode()
}
platformBrowserDynamic().bootstrapModule(AppModule)
