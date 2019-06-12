import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspConsentModalComponent} from '../../../../modules/msp-core/components/consent-modal/consent-modal.component';
import {MspCancelComponent} from '../../common/cancel/cancel.component';
import {MspLoggerDirective} from '../../common/logging/msp-logger.directive';
import { MspLogService } from '../../../../services/log.service';

import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProcessService } from '../../../../services/process.service';
import { ModalModule } from 'ngx-bootstrap';
import {MspMaintenanceService} from '../../../../services/msp-maintenance.service';
/*
describe('PrepareComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MspConsentModalComponent, MspCancelComponent, MspLoggerDirective],
      imports: [FormsModule,  HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),  ModalModule.forRoot()],
      providers: [MspDataService, MspLogService, ProcessService, MspMaintenanceService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent();
    expect(fixture.componentInstance instanceof ).toBe(true, 'should create PrepareComponent');

  });
});*/
