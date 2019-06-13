import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { ReviewComponent } from './review.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspPersonCardComponent} from '../../../../components/msp/common/person-card/person-card.component';
import {MspAddressCardPartComponent} from '../../../../components/msp/common/address-card-part/address-card-part.component';
import {MspContactCardComponent} from '../../../../components/msp/common/contact-card/contact-card.component';
import {ThumbnailComponent} from '../../../../components/msp/common/thumbnail/thumbnail.component';
import {ModalModule} from 'ngx-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import {MspCancelComponent} from '../../../../components/msp/common/cancel/cancel.component';
import {MspLoggerDirective} from '../../../msp-core/components/logging/msp-logger.directive';
import { MspLogService } from '../../../../services/log.service';

import { ProcessService } from '../../../../services/process.service';
import { CaptchaComponent } from 'mygovbc-captcha-widget/src/app/captcha/captcha.component';
import { CaptchaDataService } from 'mygovbc-captcha-widget/src/app/captcha-data.service';



describe('ReviewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewComponent, MspPersonCardComponent, MspAddressCardPartComponent,
        MspContactCardComponent, ThumbnailComponent, MspCancelComponent, MspLoggerDirective, CaptchaComponent],
      imports: [FormsModule, ModalModule.forRoot(), RouterTestingModule, HttpClientModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService, MspLogService, ProcessService, CaptchaDataService


      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(ReviewComponent);
    expect(fixture.componentInstance instanceof ReviewComponent).toBe(true, 'should create ReviewComponent');

  });
});
