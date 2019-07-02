import { AccountDocumentHelperService } from '../modules/benefit/services/account-document-helper.service';
import {MspDataService} from './msp-data.service';
import {TestBed} from '@angular/core/testing';
import {MspACLService} from '../modules/account-letter/services/msp-acl-api.service';
import {MspLogService} from './log.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
