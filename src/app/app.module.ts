import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {AccordionModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import { GeneralAppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import {TextMaskModule} from 'angular2-text-mask';
import { SharedCoreModule } from 'moh-common-lib';
import { LandingComponent } from './pages/landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { MspDataService } from './components/msp/service/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';

@NgModule({
  imports: [
    //TextMaskModule,
    BrowserModule,
    SharedCoreModule,
    HttpClientModule,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    AppRoutingModule,
  //  RouterModule.forRoot([
    //  { path: '', redirectTo: 'msp', pathMatch: 'full' }
    //]),
    LocalStorageModule.withConfig({
      prefix: 'ca.bc.gov.msp',
      storageType: 'sessionStorage'
  })
  ],
  declarations: [
    LandingComponent,
    GeneralAppComponent
  ],
  providers: [
    MspDataService
  ],

  bootstrap: [GeneralAppComponent]
})
export class AppModule {
}
