import { TestBed } from '@angular/core/testing';

import { AssistTransformService } from './assist-transform.service';

describe('AssistTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistTransformService = TestBed.get(AssistTransformService);
    expect(service).toBeTruthy();
  });
});
