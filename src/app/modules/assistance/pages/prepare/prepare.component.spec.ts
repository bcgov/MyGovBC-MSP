import {TestBed} from '@angular/core/testing';
import {Component, ViewChild, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {FormsModule, FormGroup, NgForm, AbstractControl} from '@angular/forms';

import {AssistancePrepareComponent} from './prepare.component';
import {DeductionCalculatorComponent} from './deduction-calculator/deduction-calculator.component';
import { MspDataService } from '../../../../services/msp-data.service';
import {LocalStorageService, LocalStorageModule} from 'angular-2-local-storage';
import {MspConsentModalComponent} from '../../common/consent-modal/consent-modal.component';
import {ModalModule} from 'ngx-bootstrap';
import {MspCancelComponent} from '../../common/cancel/cancel.component';
import {FileUploaderComponent} from '../../common/file-uploader/file-uploader.component';
import {ThumbnailComponent} from '../../common/thumbnail/thumbnail.component';
import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';
import {MspAssistanceYearComponent} from './assistance-year/assistance-year.component';
import { MspLogService } from '../../../../services/log.service';
import {MspLoggerDirective} from '../../common/logging/msp-logger.directive';
import {HttpClientModule} from '@angular/common/http';


describe('AssistancePrepareComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePrepareComponent, MspConsentModalComponent, MspAssistanceYearComponent,
        DeductionCalculatorComponent, MspCancelComponent, FileUploaderComponent, ThumbnailComponent,
        MspImageErrorModalComponent, MspLoggerDirective],

      imports: [FormsModule, ModalModule.forRoot(), HttpClientModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],

      providers: [MspDataService, MspLogService,

      ]
    });
  });
  // it('should work.', () => {
    // let fixture = TestBed.createComponent(AssistancePrepareComponent)
    // expect(fixture.componentInstance instanceof AssistancePrepareComponent).toBe(true, 'should create AssistancePrepareComponent')
    // expect(fixture.componentInstance.lang('./en/index').checkEligibilityScreenTitle)
    //   .toContain('See if you qualify',
    //     'Should match what is i18n file.')
  // });
});
