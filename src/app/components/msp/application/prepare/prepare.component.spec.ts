import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { PrepareComponent } from './prepare.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('PrepareComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrepareComponent, ],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(PrepareComponent);
    expect(fixture.componentInstance instanceof PrepareComponent).toBe(true, 'should create PrepareComponent');

  });
})
