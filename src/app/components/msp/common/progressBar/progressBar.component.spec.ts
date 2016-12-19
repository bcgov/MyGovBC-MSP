import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspProgressBarComponent } from './progressBar.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {RouterTestingModule} from "@angular/router/testing";

describe('MspProgressBarComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspProgressBarComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspProgressBarComponent);
    expect(fixture.componentInstance instanceof MspProgressBarComponent).toBe(true, 'should create MspProgressBarComponent');
  });
})
