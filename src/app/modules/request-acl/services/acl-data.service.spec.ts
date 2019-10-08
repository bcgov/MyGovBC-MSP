import { TestBed } from '@angular/core/testing';

import { AclDataService } from './acl-data.service';

describe('AclDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AclDataService = TestBed.get(AclDataService);
    expect(service).toBeTruthy();
  });
});
