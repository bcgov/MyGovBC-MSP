import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { EnrolDataService } from './enrol-data.service';

describe('EnrolDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ]
  }));

  it('should be created', () => {
    const service: EnrolDataService = TestBed.get(EnrolDataService);
    expect(service).toBeTruthy();
  });
});
