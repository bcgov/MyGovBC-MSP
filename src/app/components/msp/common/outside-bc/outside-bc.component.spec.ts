import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspOutsideBCComponent } from './outside-bc.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspDepartureDateComponent} from "../departure-date/departure-date.component";
import {MspReturnDateComponent} from "../return-date/return-date.component";

describe('MspOutsideBCComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspOutsideBCComponent, MspDepartureDateComponent, MspReturnDateComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspOutsideBCComponent);
    expect(fixture.componentInstance instanceof MspOutsideBCComponent).toBe(true, 'should create MspOutsideBCComponent');
  });
})
