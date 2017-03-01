import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { ReviewComponent } from './review.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspPersonCardComponent} from "../../common/person-card/person-card.component";
import {MspAddressCardPartComponent} from "../../common/address-card-part/address-card-part.component";
import {MspContactCardComponent} from "../../common/contact-card/contact-card.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {ModalModule} from "ng2-bootstrap";
import {RouterTestingModule} from "@angular/router/testing";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import appConstants from '../../../../services/appConstants';

let CaptchaComponent = require("mygovbc-captcha-widget/component").CaptchaComponent;

describe('ReviewComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewComponent, MspPersonCardComponent, MspAddressCardPartComponent,
        MspContactCardComponent, ThumbnailComponent, MspCancelComponent, MspLoggerDirective, CaptchaComponent],
      imports: [FormsModule, ModalModule, RouterTestingModule, HttpModule],
      providers: [MspDataService, MspLogService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ReviewComponent);
    expect(fixture.componentInstance instanceof ReviewComponent).toBe(true, 'should create ReviewComponent');

  });
})
