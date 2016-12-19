import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspContactCardComponent } from './contact-card.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from "../address-card-part/address-card-part.component";
import {RouterTestingModule} from "@angular/router/testing";

describe('MspContactCardComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspContactCardComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspContactCardComponent);
    expect(fixture.componentInstance instanceof MspContactCardComponent).toBe(true, 'should create MspContactCardComponent');

  });
})
