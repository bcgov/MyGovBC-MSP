import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { SharedCoreModule } from 'moh-common-lib';
import { AccountSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from '../../../../services/msp-api.service';
import { ProcessService } from '../../../../services/process.service';
import {HttpClientModule} from '@angular/common/http';
import {MspLogService} from '../../../../services/log.service';
import {MspMaintenanceService} from '../../../../services/msp-maintenance.service';
import { TransmissionErrorView } from '../../../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';

describe('SendingComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountSendingComponent,
        TransmissionErrorView
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        SharedCoreModule
      ],
      providers: [
        MspDataService,
        MspApiService,
        ProcessService,
        MspLogService,
        MspMaintenanceService,
        MspAccountMaintenanceDataService
      ]
    });
  });
  it ('should work', () => {
     const fixture = TestBed.createComponent(AccountSendingComponent);
     expect(fixture.componentInstance instanceof AccountSendingComponent).toBe(true, 'should create AccountSendingComponent');

  });
});
