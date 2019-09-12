import { TestBed } from '@angular/core/testing';

import { MspApiEnrolmentService } from './msp-api-enrolment.service';

describe('MspApiEnrolmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MspApiEnrolmentService = TestBed.get(MspApiEnrolmentService);
    expect(service).toBeTruthy();
  });
});
