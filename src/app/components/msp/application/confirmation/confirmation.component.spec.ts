import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule }    from '@angular/http';
import { ConfirmationComponent } from './confirmation.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import { MspLogService } from '../../service/log.service';
import appConstants from '../../../../services/appConstants';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';
import { RouterTestingModule } from '@angular/router/testing';


describe('Component Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent, MspLoggerDirective],
      imports: [HttpModule, RouterModule, RouterTestingModule],
      providers: [MspDataService, MspLogService,ActivatedRoute,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(ConfirmationComponent);
  //   expect(fixture.componentInstance instanceof ConfirmationComponent).toBe(true, 'should create ConfirmationComponent');

  // });
})
