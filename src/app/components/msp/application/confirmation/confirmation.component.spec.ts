import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { ConfirmationComponent } from './confirmation.component'
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('Component Test', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent],
      imports: [],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(ConfirmationComponent);
    expect(fixture.componentInstance instanceof ConfirmationComponent).toBe(true, 'should create ConfirmationComponent');

  });
})
