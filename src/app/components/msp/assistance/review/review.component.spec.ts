import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';

import { AssistanceReviewComponent } from './review.component'
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspPersonCardComponent} from "../../common/person-card/person-card.component";
import {MspContactCardComponent} from "../../common/contact-card/contact-card.component";
import {EligibilityCardComponent} from "../prepare/eligibility-card/eligibility-card.component";
import {MspAddressCardPartComponent} from "../../common/address-card-part/address-card-part.component";
import {ThumbnailComponent} from "../../common/thumbnail/thumbnail.component";
import {RouterTestingModule} from "@angular/router/testing";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import {MspLogService} from "../../service/log.service";
import { ModalModule } from "ngx-bootstrap";

import { ProcessService } from "../../service/process.service";
import {HttpClientModule} from "@angular/common/http";

describe('AssistanceReviewComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceReviewComponent, MspPersonCardComponent, MspContactCardComponent,
        EligibilityCardComponent, MspAddressCardPartComponent, ThumbnailComponent, MspCancelComponent,
        MspLoggerDirective],
      imports: [FormsModule, RouterTestingModule,  HttpClientModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })  ,ModalModule.forRoot()],
      providers: [MspDataService,MspLogService, ProcessService,
        
        
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceReviewComponent)
    expect(fixture.componentInstance instanceof AssistanceReviewComponent).toBe(true, 'should create AssistanceReviewComponent')
  });
})
