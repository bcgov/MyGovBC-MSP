import { TestBed } from '@angular/core/testing'
import { FormsModule } from '@angular/forms';
import { AssistanceConfirmationComponent } from './confirmation.component';
import MspDataService from '../../service/msp-data.service';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';

describe('AssistanceConfirmationComponent', () => {
  let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'localStorage'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssistanceConfirmationComponent],
      imports: [FormsModule],
      providers: [MspDataService,
        LocalStorageService,{
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
      ]
    })
  });
  it ('should work', () => {
    let fixture = TestBed.createComponent(AssistanceConfirmationComponent);
    expect(fixture.componentInstance instanceof AssistanceConfirmationComponent).toBe(true, 'should create AssistanceConfirmationComponent');

  });
})
