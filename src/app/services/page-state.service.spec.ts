import { TestBed } from '@angular/core/testing';

import { PageStateService } from './page-state.service';

describe('PageStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageStateService = TestBed.get(PageStateService);
    expect(service).toBeTruthy();
  });
});
