import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspPhnComponent } from './phn.component';
import MspDataService from '../../service/msp-data.service';
import ValidationService from '../../service/msp-validation.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {Mod11CheckValidator} from "./phn.validator";
import CompletenessCheckService from '../../service/completeness-check.service';

describe('MspPhnComponent Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhnComponent, Mod11CheckValidator],
      imports: [FormsModule],
      providers: [MspDataService, CompletenessCheckService,ValidationService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspPhnComponent);
    expect(fixture.componentInstance instanceof MspPhnComponent).toBe(true, 'should create MspPhnComponent');
  });
})
