import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AccountLetterSendingComponent } from './sending.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from '../../service/msp-api.service';
import {HttpClientModule} from '@angular/common/http';
import { ProcessService } from '../../service/process.service';
import {TransmissionErrorView} from '../../common/transmission-error-view/transmission-error-view.component';
import { MspLogService } from '../../service/log.service';
import {MspMaintenanceService} from '../../service/msp-maintenance.service';

describe('AccountLetterSendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLetterSendingComponent , TransmissionErrorView],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService, MspLogService, MspMaintenanceService]
    });
  });
  it ('should work', () => {
     const fixture = TestBed.createComponent(AccountLetterSendingComponent);
     expect(fixture.componentInstance instanceof AccountLetterSendingComponent).toBe(true, 'should create SendingComponent');

  });
});
