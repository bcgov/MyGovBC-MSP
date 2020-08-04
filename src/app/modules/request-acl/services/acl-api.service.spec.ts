import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { AclApplication } from '../model/acl-application.model';
import { AclApiService } from './acl-api.service';

describe('AclApiService', () => {
  let service: AclApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AclApiService]
    });
    service = TestBed.get(AclApiService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
