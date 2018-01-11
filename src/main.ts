import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'
import {enableProdMode} from '@angular/core'
import {AppModule} from './app/app.module'
import 'file-loader?name=[name].[ext]!./favicon.ico'
import 'file-loader?name=[name].[ext]!./robots.txt'
import { environment } from './environments/environment';
if (environment.appConstants.runtimeEnv === 'production') {
  enableProdMode()
}
platformBrowserDynamic().bootstrapModule(AppModule)
