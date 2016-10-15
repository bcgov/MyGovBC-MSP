import {NgModule, OpaqueToken, Inject} from '@angular/core'
import {BrowserModule}  from '@angular/platform-browser'
import {HomeComponent} from './components/home'
import appConstants from './services/appConstants'
require('./index.less')
@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HomeComponent
  ],
  providers: [{provide: 'appConstants', useValue: appConstants}],
  bootstrap: [HomeComponent]
})
export class AppModule {
}
