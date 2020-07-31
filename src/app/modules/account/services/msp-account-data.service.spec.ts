import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MspAccountMaintenanceDataService } from './msp-account-data.service';

describe('MspBenefitDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),
    ],
    providers: [ MspAccountMaintenanceDataService ]
  }));

  it('should be created', () => {
    const service: MspAccountMaintenanceDataService = TestBed.get(MspAccountMaintenanceDataService);
    expect(service).toBeTruthy();
  });
});
