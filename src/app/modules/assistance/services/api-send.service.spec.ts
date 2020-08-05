import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiSendService } from './api-send.service';

describe('ApiSendService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ApiSendService = TestBed.get(ApiSendService);
    expect(service).toBeTruthy();
  });
});
