/* tslint:disable:no-unused-variable */
import {
    JsonpModule,
    Jsonp,
    BaseRequestOptions,
    Response,
    ResponseOptions,
    Http
} from "@angular/http";
import {TestBed, getTestBed, fakeAsync, tick, inject} from '@angular/core/testing';
import {MspACLService} from './msp-acl-api.service';
import {MspLogService} from './log.service';
import {MspDataService} from './msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ISpaEnvResponse} from '../model/spa-env-response.interface';
import { AccountLetterApplication } from '../model/account-letter-application.model';
import { AccountLetterApplicantTypeFactory, AccountLetterType  } from '../../../modules/enrolment/pages/api-model/accountLetterTypes';


describe('MspACLService', () => {
    let injector: TestBed;
    let service: MspACLService;
    let httpMock: HttpTestingController;
    let spaEnvRes: ISpaEnvResponse;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, HttpClientModule,
          RouterTestingModule,
          FormsModule,
          LocalStorageModule.withConfig({
              prefix: 'ca.bc.gov.msp',
              storageType: 'sessionStorage'
          }) ],
        providers: [ LocalStorageService , MspACLService, MspLogService, MspDataService]
      });
       injector = getTestBed();
       service = injector.get(MspACLService);
       httpMock = injector.get(HttpTestingController);
    });

    it('should be created', inject([MspACLService], (service: MspACLService) => {
      expect(service).toBeTruthy();
    }));

  });


