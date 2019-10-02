import { TestBed } from '@angular/core/testing';
import { MspApiBenefitService } from '../../benefit/services/msp-api-benefit.service';

describe('MspApiBenefitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MspApiBenefitService = TestBed.get(MspApiBenefitService);
    expect(service).toBeTruthy();
  });
});
