import { TestBed } from '@angular/core/testing';

import { AssistStateService } from './assist-state.service';

describe('AssistStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistStateService = TestBed.get(AssistStateService);
    expect(service).toBeTruthy();
  });
});
