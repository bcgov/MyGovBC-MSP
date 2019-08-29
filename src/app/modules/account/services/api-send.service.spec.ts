import { TestBed } from '@angular/core/testing';

import { ApiSendService } from './api-send.service';

describe('ApiSendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiSendService = TestBed.get(ApiSendService);
    expect(service).toBeTruthy();
  });
});
