import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AccordionModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { GeneralAppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { SharedCoreModule } from 'moh-common-lib';
import { LandingComponent } from './pages/landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { MspDataService } from './services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ProcessService } from './services/process.service';
import { MspLogService } from './services/log.service';
import { CompletenessCheckService } from './services/completeness-check.service';
import { MspApiService } from './services/msp-api.service';
import { PersonalComponent } from './modules/assistance/pages/personal/personal.component';

@NgModule({
  imports: [
    //TextMaskModule,
    BrowserModule,
    SharedCoreModule,
    HttpClientModule,
    //ModalModule.forRoot(),
    //AccordionModule.forRoot(),
    //TooltipModule.forRoot(),
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
    GeneralAppComponent,
    PersonalComponent
  ],
  providers: [
    MspDataService,
    ProcessService,
    MspLogService,
    CompletenessCheckService,

    // Called by Completeness Check Service - PHN check, probably can be removed once
    // phn component from common lib is use - will require re-factoring
    MspApiService
  ],

  bootstrap: [GeneralAppComponent]
})
export class AppModule {
}
