import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaService } from 'app/services/schema.service';
import { MspLogService } from 'app/services/log.service';
import { ApiSendService } from './api-send.service';

describe('ApiSendService', () => {
  let service: ApiSendService;

  beforeEach(() => {
    const schemaServiceStub = () => ({ validate: app => ({}) });
    const mspLogServiceStub = () => ({ log: (object, arg) => ({}) });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiSendService,
        { provide: SchemaService, useFactory: schemaServiceStub },
        { provide: MspLogService, useFactory: mspLogServiceStub }
      ]
    });
    service = TestBed.get(ApiSendService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
