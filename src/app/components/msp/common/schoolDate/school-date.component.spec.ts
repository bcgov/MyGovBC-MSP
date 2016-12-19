import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { MspSchoolDateComponent } from './school-date.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('MspSchoolDateComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspSchoolDateComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(MspSchoolDateComponent);
    expect(fixture.componentInstance instanceof MspSchoolDateComponent).toBe(true, 'should create MspSchoolDateComponent');
  });
})
