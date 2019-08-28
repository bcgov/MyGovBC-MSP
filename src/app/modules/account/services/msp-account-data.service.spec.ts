import { TestBed } from '@angular/core/testing';

import { MspAccountMaintenanceDataService } from './msp-account-data.service';

describe('MspBenefitDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MspAccountMaintenanceDataService = TestBed.get(MspAccountMaintenanceDataService);
    expect(service).toBeTruthy();
  });
});
