import {NgModule, OpaqueToken, Inject} from '@angular/core'
import {BrowserModule}  from '@angular/platform-browser'
import {RouterModule} from '@angular/router';

import {HomeComponent} from './components/home'
import {CoreHeaderComponent} from './components/core/header'
import {CoreFooterComponent} from './components/core/footer'

import {MspModule} from './components/msp/msp.module'
import {GeneralAppComponent} from './app.component'
let appConstants = require('./services/appConstants')
require('./index.less')
@NgModule({
  imports: [
    BrowserModule,
    MspModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'msp', pathMatch: 'full'},
      // { path: '**', redirectTo: 'msp', pathMatch: 'full' }
    ])

  ],
  declarations: [
    HomeComponent, CoreHeaderComponent, CoreFooterComponent,
    GeneralAppComponent
  ],

  providers: [{provide: 'appConstants', useValue: appConstants}],
  bootstrap: [CoreHeaderComponent, CoreFooterComponent, GeneralAppComponent]
})
export class AppModule {
}
