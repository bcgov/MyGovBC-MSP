import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspConsentModalComponent } from './consent-modal.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import {ModalModule} from 'ngx-bootstrap';
import {MspMaintenanceService} from '../../../../services/msp-maintenance.service';
import {HttpClientModule} from '@angular/common/http';
import {MspLogService} from '../../../../services/log.service';
import { SharedCoreModule } from 'moh-common-lib';


describe('MspConsentModalComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspConsentModalComponent],
      imports: [FormsModule, HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),
        ModalModule.forRoot(),
        SharedCoreModule
      ],
        providers: [MspDataService, MspMaintenanceService, MspLogService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspConsentModalComponent);
    expect(fixture.componentInstance instanceof MspConsentModalComponent).toBe(true, 'should create MspConsentModalComponent');

  });
});
