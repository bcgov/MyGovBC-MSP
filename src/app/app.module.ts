import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GeneralAppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedCoreModule } from 'moh-common-lib';
import { LandingComponent } from './pages/landing/landing.component';
import { AppRoutingModule } from './app-routing.module';
import { MspDataService } from './services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ProcessService } from './services/process.service';
import { MspLogService } from './services/log.service';
import { CompletenessCheckService } from './services/completeness-check.service';
import { MspApiService } from './services/msp-api.service';
import { AclDataService } from './modules/request-acl/services/acl-data.service';
import { EnrolDataService } from './modules/enrolment/services/enrol-data.service';
import { environment } from '../environments/environment';
import { fakeBackendProvider } from './_developmentHelpers/fake-backend';

const providerList: any = [
  MspDataService,
  ProcessService,
  MspLogService,
  CompletenessCheckService,

  // Called by Completeness Check Service - PHN check, probably can be removed once
  // phn component from common lib is use - will require re-factoring
  MspApiService,

  // Services used by home page
  AclDataService,
  EnrolDataService
];

if ( environment.useMockBackend ) {
  // provider used to create fake backend - development of registration modules
  providerList.push( fakeBackendProvider );
}

@NgModule({
  imports: [
    BrowserModule,
    SharedCoreModule,
    HttpClientModule,
    AppRoutingModule,
    LocalStorageModule.withConfig({
      prefix: 'ca.bc.gov.msp',
      storageType: 'sessionStorage'
    }),
  ],
  declarations: [
    LandingComponent,
    GeneralAppComponent
  ],
  providers: [
    providerList
  ],

  bootstrap: [GeneralAppComponent]
})
export class AppModule {}
