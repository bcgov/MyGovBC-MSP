import { TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceSendingComponent } from './sending.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from '../../service/msp-api.service';
import { ProcessService } from '../../service/process.service';
import {HttpClientModule} from '@angular/common/http';
import {MspLogService} from '../../service/log.service';
import {TransmissionErrorView} from '../../common/transmission-error-view/transmission-error-view.component';
import {MspMaintenanceService} from '../../service/msp-maintenance.service';

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
