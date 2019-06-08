import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {AccordionModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import { GeneralAppComponent } from './app.component';
import { MspModule } from './components/msp/msp.module';
import { HttpClientModule} from '@angular/common/http';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports: [
    TextMaskModule,
    BrowserModule,
    MspModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    RouterModule.forRoot([
      { path: '', redirectTo: 'msp', pathMatch: 'full' }
    ])
  ],
  declarations: [
    GeneralAppComponent
  ],

  bootstrap: [GeneralAppComponent]
})
export class AppModule {
}
