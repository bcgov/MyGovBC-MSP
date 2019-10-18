import { TestBed } from '@angular/core/testing';

import { EnrolDataService } from './enrol-data.service';

describe('EnrolDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrolDataService = TestBed.get(EnrolDataService);
    expect(service).toBeTruthy();
  });
});
