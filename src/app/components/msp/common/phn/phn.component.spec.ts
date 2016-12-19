import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspPhnComponent } from './phn.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {Mod11CheckValidator} from "./phn.validator";

describe('MspPhnComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPhnComponent, Mod11CheckValidator],
      imports: [FormsModule],
      providers: [MspDataService,
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
