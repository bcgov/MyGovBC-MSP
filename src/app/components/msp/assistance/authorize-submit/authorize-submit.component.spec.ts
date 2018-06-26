import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import { MspValidationService } from '../../service/msp-validation.service';

import { CompletenessCheckService } from '../../service/completeness-check.service';
import { ProcessService } from "../../service/process.service";
import {RouterTestingModule} from "@angular/router/testing";
//import { CaptchaDataService } from '../../../mygovbc-captcha-widget/src/app/captcha-data.service'
//import { CaptchaComponent } from '../../../mygovbc-captcha-widget/src/app/captcha/captcha.component'
import { CaptchaDataService} from "../../../../../mygovbc-captcha-widget/src/app/captcha-data.service";
import { ModalModule } from "ngx-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {CaptchaComponent} from "../../../../../mygovbc-captcha-widget/src/app/captcha/captcha.component";

describe('AssistanceAuthorizeSubmitComponent Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceAuthorizeSubmitComponent, FileUploaderComponent, ThumbnailComponent, MspCancelComponent,
        MspImageErrorModalComponent,MspLoggerDirective, MspLoggerDirective, CaptchaComponent],
      imports: [FormsModule,  HttpClientModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),   ModalModule.forRoot()],
      providers: [MspDataService, MspLogService,CompletenessCheckService,MspValidationService,ProcessService,CaptchaDataService
        
        
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    expect(fixture.componentInstance instanceof AssistanceAuthorizeSubmitComponent).toBe(true, 'should create AssistanceAuthorizeSubmitComponent');

  });
})
