/* tslint:disable:no-unused-variable */
import {TestBed, getTestBed, inject} from '@angular/core/testing';
import {MspACLService} from './msp-acl-api.service';
import {MspLogService} from '../../../services/log.service';
import {MspDataService} from '../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MspACLService', () => {
    let injector: TestBed;

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
    });

    it('should be created', inject([MspACLService], (service: MspACLService) => {
      expect(service).toBeTruthy();
    }));

  });


