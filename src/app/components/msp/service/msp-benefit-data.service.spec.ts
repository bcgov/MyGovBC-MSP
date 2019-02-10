import { TestBed } from '@angular/core/testing';

import { MspBenefitDataService } from './msp-benefit-data.service';

describe('MspBenefitDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MspBenefitDataService = TestBed.get(MspBenefitDataService);
    expect(service).toBeTruthy();
  });
});
