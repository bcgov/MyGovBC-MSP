import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AccountLetterSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import { ProcessService } from '../../../../services/process.service';
import {TransmissionErrorView} from '../../common/transmission-error-view/transmission-error-view.component';
import { MspLogService } from '../../../../services/log.service';
import { MspACLService } from '../../service/msp-acl-api.service';
import {AclErrorViewComponent} from '../../account-letter/sending/acl-error-view/acl-error-view.component';


describe('AccountLetterSendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLetterSendingComponent , TransmissionErrorView, AclErrorViewComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, ProcessService, MspLogService, MspACLService]
    });
  });
  it ('should work', () => {
     const fixture = TestBed.createComponent(AccountLetterSendingComponent);

     expect(fixture.componentInstance instanceof AccountLetterSendingComponent).toBe(true, 'should create AccountLetterSendingComponent');

  });
});
