import {NgModule, OpaqueToken, Inject} from '@angular/core'
import {BrowserModule}  from '@angular/platform-browser'
import {HomeComponent} from './components/home'
import {CoreHeaderComponent} from './components/core/header'
import {CoreFooterComponent} from './components/core/footer'
let appConstants = require('./services/appConstants')
require('./index.less')
@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HomeComponent, CoreHeaderComponent, CoreFooterComponent
  ],
  providers: [{provide: 'appConstants', useValue: appConstants}],
  bootstrap: [HomeComponent, CoreHeaderComponent, CoreFooterComponent]
})
export class AppModule {
}
