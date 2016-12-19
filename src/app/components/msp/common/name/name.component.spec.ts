import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspNameComponent } from './name.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('MspNameComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspNameComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspNameComponent);
    expect(fixture.componentInstance instanceof MspNameComponent).toBe(true, 'should create MspNameComponent');
  });
})
