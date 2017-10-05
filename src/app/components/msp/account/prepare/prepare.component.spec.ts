import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AccountPrepareComponent } from './prepare.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspConsentModalComponent} from "../../common/consent-modal/consent-modal.component";
import {Ng2BootstrapModule} from "ng2-bootstrap";
import {MspCancelComponent} from "../../common/cancel/cancel.component";
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import appConstants from '../../../../services/appConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import ProcessService from "../../service/process.service";

describe('AccountPrepareComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountPrepareComponent, MspConsentModalComponent, MspCancelComponent, MspLoggerDirective],
      imports: [FormsModule, Ng2BootstrapModule.forRoot(), HttpModule, RouterTestingModule],
      providers: [MspDataService, MspLogService, ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
        
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AccountPrepareComponent);
    expect(fixture.componentInstance instanceof AccountPrepareComponent).toBe(true, 'should create AccountPrepareComponent');

  });
})
