import {NgModule, OpaqueToken, Inject, Component} from '@angular/core'
import {BrowserModule}  from '@angular/platform-browser'
import {RouterModule} from '@angular/router';

import {CoreHeaderComponent} from './components/core/header'
import {CoreFooterComponent} from './components/core/footer'
import { ModalModule, AccordionModule} from 'ngx-bootstrap';
import {MspModule} from './components/msp/msp.module'
import {GeneralAppComponent} from './app.component'

require('./index.less')
@NgModule({
  imports: [
    BrowserModule,
    MspModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'msp', pathMatch: 'full' }
    ])
    
  ],
  declarations: [
    CoreHeaderComponent, CoreFooterComponent, 
    GeneralAppComponent
  ],
  bootstrap: [CoreHeaderComponent, CoreFooterComponent, GeneralAppComponent]
})
export class AppModule {
}
