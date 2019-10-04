import { TestBed } from '@angular/core/testing';

import { BaseMspDataService } from './base-msp-data.service';

describe('BaseMspDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseMspDataService = TestBed.get(BaseMspDataService);
    expect(service).toBeTruthy();
  });
});
