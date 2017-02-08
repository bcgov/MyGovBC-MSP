import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { AssistanceConfirmationComponent } from './confirmation.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspLoggerDirective} from "../../common/logging/msp-logger.directive";
import {MspLogService} from "../../service/log.service";
import {HttpModule} from "@angular/http";
import appConstants from '../../../../services/appConstants';

describe('AssistanceConfirmationComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent, MspLoggerDirective],
      imports: [FormsModule, HttpModule],
      providers: [MspDataService,MspLogService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceConfirmationComponent);
    expect(fixture.componentInstance instanceof AssistanceConfirmationComponent).toBe(true, 'should create AssistanceConfirmationComponent');

  });
})
