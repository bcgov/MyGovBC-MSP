import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspDischargeDateComponent } from './discharge-date.component';
import MspDataService from '../../service/msp-data.service';
import appConstants from '../../../../services/appConstants';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('MspDischargeDateComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspDischargeDateComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        },
        {provide: 'appConstants', useValue: appConstants}
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspDischargeDateComponent);
    expect(fixture.componentInstance instanceof MspDischargeDateComponent).toBe(true, 'should create MspDischargeDateComponent');

  });
})
