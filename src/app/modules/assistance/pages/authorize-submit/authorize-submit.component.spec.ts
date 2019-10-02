import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';

import {MspImageErrorModalComponent} from '../../../msp-core/components/image-error-modal/image-error-modal.component';

import { MspLogService } from '../../../../services/log.service';


import { CompletenessCheckService } from '../../../../services/completeness-check.service';

import {RouterTestingModule} from '@angular/router/testing';
//import { CaptchaDataService } from '../../../mygovbc-captcha-widget/src/app/captcha-data.service'
//import { CaptchaComponent } from '../../../mygovbc-captcha-widget/src/app/captcha/captcha.component'

import { ModalModule } from 'ngx-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { SharedCoreModule } from 'moh-common-lib';


describe('AssistanceAuthorizeSubmitComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AssistanceAuthorizeSubmitComponent,
        MspImageErrorModalComponent
      ],
      imports: [
        FormsModule,
        SharedCoreModule,
        HttpClientModule,
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
      ModalModule.forRoot()
    ],
      providers: [
        MspDataService,
        MspLogService,
         CompletenessCheckService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    expect(fixture.componentInstance instanceof AssistanceAuthorizeSubmitComponent).toBe(true, 'should create AssistanceAuthorizeSubmitComponent');

  });
});
