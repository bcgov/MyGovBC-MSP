import { TestBed } from '@angular/core/testing';

import { BaseMspApiService } from './base-msp-api.service';

describe('BaseMspApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BaseMspApiService = TestBed.get(BaseMspApiService);
    expect(service).toBeTruthy();
  });
});
