import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AccountSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from '../../../../services/msp-api.service';
import { ProcessService } from '../../../../services/process.service';
import {HttpClientModule} from '@angular/common/http';
import {MspLogService} from '../../../../services/log.service';
import {MspMaintenanceService} from '../../../../services/msp-maintenance.service';
import { TransmissionErrorView } from '../../../../components/msp/common/transmission-error-view/transmission-error-view.component';

describe('SendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountSendingComponent , TransmissionErrorView],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService, MspLogService, MspMaintenanceService]
    });
  });
  it ('should work', () => {
     const fixture = TestBed.createComponent(AccountSendingComponent);
     expect(fixture.componentInstance instanceof AccountSendingComponent).toBe(true, 'should create AccountSendingComponent');

  });
});
