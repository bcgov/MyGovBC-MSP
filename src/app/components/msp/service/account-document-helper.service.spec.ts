import { AccountDocumentHelperService } from './account-document-helper.service';
import {MspLog2Service} from './log2.service';
import {MspDataService} from '../../../services/msp-data.service';
import {MspPhnComponent} from '../../msp/common/phn/phn.component';
/* tslint:disable:no-unused-variable */
import {
  JsonpModule,
  Jsonp,
  BaseRequestOptions,
  Response,
  ResponseOptions,
  Http
} from "@angular/http";
import {TestBed, getTestBed, fakeAsync, tick} from '@angular/core/testing';
import {MspACLService} from './msp-acl-api.service';
import {MspLogService} from '../../../services/log.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ISpaEnvResponse} from '../model/spa-env-response.interface';
import { AccountLetterApplication } from '../model/account-letter-application.model';
import { AccountLetterApplicantTypeFactory, AccountLetterType  } from '../../../modules/enrolment/pages/api-model/accountLetterTypes';

describe('AccountDocumentHelperService', () => {
  
  beforeEach(() => { TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, HttpClientModule,
      RouterTestingModule,
      FormsModule,
      LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      }) ],
    providers: [ LocalStorageService , MspACLService, MspLogService, MspDataService]
  });
  
});

  it('should be created', () => {
    const service: AccountDocumentHelperService = TestBed.get(AccountDocumentHelperService);
    expect(service).toBeTruthy();
  });
});
