import { TestBed } from '@angular/core/testing';

import { GuardEnrolService } from './guard-enrol.service';

describe('GuardEnrolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuardEnrolService = TestBed.get(GuardEnrolService);
    expect(service).toBeTruthy();
  });
});
