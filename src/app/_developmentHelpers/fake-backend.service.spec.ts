import { TestBed, inject } from '@angular/core/testing';

import { FakeBackendService } from './fake-backend.service';

describe('FakeBackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FakeBackendService]
    });
  });

  it('should be created', inject([FakeBackendService], (service: FakeBackendService) => {
    expect(service).toBeTruthy();
  }));
});
