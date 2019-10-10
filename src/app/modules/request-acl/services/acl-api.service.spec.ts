import { TestBed } from '@angular/core/testing';

import { AclApiService } from './acl-api.service';

describe('AclApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AclApiService = TestBed.get(AclApiService);
    expect(service).toBeTruthy();
  });
});
