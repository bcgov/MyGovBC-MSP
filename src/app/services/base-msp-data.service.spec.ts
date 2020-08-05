import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BaseMspDataService } from './base-msp-data.service';

describe('BaseMspDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ]
  }));

  it('should be created', () => {
    const service: BaseMspDataService = TestBed.get(BaseMspDataService);
    expect(service).toBeTruthy();
  });
});
