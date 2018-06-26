import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';

import { ConfirmationComponent } from './confirmation.component'
import { MspDataService } from '../../service/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Subscription} from "rxjs/internal/Subscription";

describe('Component Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent, MspLoggerDirective],
      imports: [HttpClientModule, RouterModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ],
      providers: [MspDataService, MspLogService,ActivatedRoute,
  
      ]
    })
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(ConfirmationComponent);
  //   expect(fixture.componentInstance instanceof ConfirmationComponent).toBe(true, 'should create ConfirmationComponent');

  // });
})
