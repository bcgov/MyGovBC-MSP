import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspAddressCardPartComponent } from './address-card-part.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {MspProvinceComponent} from "../province/province.component";
import {Ng2CompleterModule} from "ng2-completer";

describe('MspAddressCardPartComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspAddressCardPartComponent],
      imports: [FormsModule, Ng2CompleterModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspAddressCardPartComponent);
    expect(fixture.componentInstance instanceof MspAddressCardPartComponent).toBe(true, 'should create MspAddressCardPartComponent');

  });
})
