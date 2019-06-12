import { AccountDocumentHelperService } from './account-document-helper.service';
import {MspDataService} from '../../../services/msp-data.service';
import {TestBed} from '@angular/core/testing';
import {MspACLService} from './msp-acl-api.service';
import {MspLogService} from '../../../services/log.service';
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
