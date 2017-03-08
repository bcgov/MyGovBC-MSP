import {TestBed} from '@angular/core/testing'
import {Component, ViewChild, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {FormsModule, FormGroup, NgForm, AbstractControl} from '@angular/forms';
import { HttpModule } from '@angular/http';

import {AssistancePrepareComponent} from './prepare.component'
import {DeductionCalculatorComponent} from './deduction-calculator/deduction-calculator.component';
import MspDataService from '../../service/msp-data.service';
import {LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG} from 'angular-2-local-storage';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {ModalModule} from "ng2-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {MspAssistanceYearComponent} from "./assistance-year/assistance-year.component";
import { MspLogService } from '../../service/log.service';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import appConstants from '../../../../services/appConstants';

describe('AssistancePrepareComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistancePrepareComponent, MspConsentModalComponent,MspAssistanceYearComponent,
        DeductionCalculatorComponent, MspCancelComponent, FileUploaderComponent, ThumbnailComponent,
        MspImageErrorModalComponent, MspLoggerDirective],

      imports: [FormsModule, ModalModule, HttpModule],

      providers: [MspDataService, MspLogService,
        LocalStorageService, {
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  // it('should work.', () => {
    // let fixture = TestBed.createComponent(AssistancePrepareComponent)
    // expect(fixture.componentInstance instanceof AssistancePrepareComponent).toBe(true, 'should create AssistancePrepareComponent')
    // expect(fixture.componentInstance.lang('./en/index').checkEligibilityScreenTitle)
    //   .toContain('See if you qualify',
    //     'Should match what is i18n file.')
  // });
})
