import {NgModule} from '@angular/core'
import {BrowserModule}  from '@angular/platform-browser'
import {HomeComponent} from './components/home'
require('./index.less')
@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    HomeComponent
  ],
  bootstrap: [HomeComponent]
})
export class AppModule {
}
