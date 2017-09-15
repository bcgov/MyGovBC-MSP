import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import MspDataService from '../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";
import appConstants from '../../../services/appConstants';
import ProcessService from "../service/process.service";
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [MspDataService, ProcessService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AccountComponent);
    expect(fixture.componentInstance instanceof AccountComponent).toBe(true, 'should create AccountComponent');

  });
})
