import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AssistanceAuthorizeSubmitComponent } from './authorize-submit.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {FileUploaderComponent} from "../../common/file-uploader/file-uploader.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspImageErrorModalComponent} from "../../common/image-error-modal/image-error-modal.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import ValidationService from '../../service/msp-validation.service';
import appConstants from '../../../../services/appConstants';
import CompletenessCheckService from '../../service/completeness-check.service';
import ProcessService from "../../service/process.service";
import {RouterTestingModule} from "@angular/router/testing";
let CaptchaComponent = require("mygovbc-captcha-widget/component").CaptchaComponent;

describe('AssistanceAuthorizeSubmitComponent Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceAuthorizeSubmitComponent, FileUploaderComponent, ThumbnailComponent, MspCancelComponent,
        MspImageErrorModalComponent,MspLoggerDirective, MspLoggerDirective, CaptchaComponent],
      imports: [FormsModule, Ng2BootstrapModule, HttpModule, RouterTestingModule],
      providers: [MspDataService, MspLogService,CompletenessCheckService,ValidationService,ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceAuthorizeSubmitComponent);
    expect(fixture.componentInstance instanceof AssistanceAuthorizeSubmitComponent).toBe(true, 'should create AssistanceAuthorizeSubmitComponent');

  });
})
