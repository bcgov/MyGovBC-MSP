import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';

import { AssistanceReviewComponent } from './review.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspPersonCardComponent} from "../../common/person-card/person-card.component";
import {MspContactCardComponent} from "../../common/contact-card/contact-card.component";
import {EligibilityCardComponent} from "../prepare/eligibility-card/eligibility-card.component";
import {MspAddressCardPartComponent} from "../../common/address-card-part/address-card-part.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {RouterTestingModule} from "@angular/router/testing";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import {MspLogService} from "../../service/log.service";
import {HttpModule} from "@angular/http";
import appConstants from '../../../../services/appConstants';
import ProcessService from "../../service/process.service";

describe('AssistanceReviewComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceReviewComponent, MspPersonCardComponent, MspContactCardComponent,
        EligibilityCardComponent, MspAddressCardPartComponent, ThumbnailComponent, MspCancelComponent,
        MspLoggerDirective],
      imports: [FormsModule, RouterTestingModule, Ng2BootstrapModule.forRoot(), HttpModule],
      providers: [MspDataService,MspLogService, ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceReviewComponent)
    expect(fixture.componentInstance instanceof AssistanceReviewComponent).toBe(true, 'should create AssistanceReviewComponent')
  });
})
