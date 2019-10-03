import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceSendingComponent } from './sending.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from '../../../../services/msp-api.service';
import {HttpClientModule} from '@angular/common/http';
import {MspLogService} from '../../../../services/log.service';
import { TransmissionErrorView } from '../../../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { ProcessService } from '../../../../services/process.service';
import { MspMaintenanceService } from '../../../../services/msp-maintenance.service';


describe('AssistanceSendingComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceSendingComponent, TransmissionErrorView ],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspApiService, ProcessService , MspLogService, MspMaintenanceService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistanceSendingComponent);
    expect(fixture.componentInstance instanceof AssistanceSendingComponent).toBe(true, 'should create AssistanceSendingComponent');

  });
});
