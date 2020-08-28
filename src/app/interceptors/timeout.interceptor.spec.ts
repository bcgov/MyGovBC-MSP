import { TestBed } from '@angular/core/testing';
import { HttpHandler } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { TimeoutInterceptor, DEFAULT_TIMEOUT } from './timeout.interceptor';

fdescribe('TimeoutInterceptor', () => {
  let service: TimeoutInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [TimeoutInterceptor, [{ provide: DEFAULT_TIMEOUT, useValue: 60000 }]] });
    service = TestBed.get(TimeoutInterceptor);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('intercept', () => {
    it('makes expected calls', () => {
      const httpHandlerStub: HttpHandler = <any>{ handle: () => ({ pipe: () => {} }) };
      const httpRequestStub: HttpRequest<any> = <any>{ headers: { get: () => {} } };
      spyOn(httpHandlerStub, 'handle').and.callThrough();
      service.intercept(httpRequestStub, httpHandlerStub);
      expect(httpHandlerStub.handle).toHaveBeenCalled();
    });
  });
});
