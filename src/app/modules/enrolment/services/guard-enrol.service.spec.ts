import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { GuardEnrolService } from './guard-enrol.service';

describe('GuardEnrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ]
  }));

  it('should be created', () => {
    const service: GuardEnrolService = TestBed.get(GuardEnrolService);
    expect(service).toBeTruthy();
  });
});
