/* tslint:disable:no-unused-variable */
import {
    BaseRequestOptions,
    Http,
    XHRBackend
} from '@angular/http';
import {TestBed, getTestBed, async, fakeAsync, tick, inject } from '@angular/core/testing';
import {MspMaintenanceService} from './msp-maintenance.service';
import {MspLog2Service} from './log2.service';
import {MspDataService} from './msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { environment } from '../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MspLog2Service', () => {
    let injector: TestBed;
    let service: MspLog2Service;
    let httpMock: HttpTestingController;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, HttpClientModule,
          RouterTestingModule,
          FormsModule,
          LocalStorageModule.withConfig({
              prefix: 'ca.bc.gov.msp',
              storageType: 'sessionStorage'
          }) ],
        providers: [ BaseRequestOptions, MockBackend, LocalStorageService , MspLog2Service, MspDataService, MspMaintenanceService,
            {
                deps: [
                    MockBackend,
                    BaseRequestOptions
                ],
                provide: Http,
                useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                    return new Http(backend, defaultOptions);
                }
            }]
      });
      injector = getTestBed();
      const testbed = getTestBed();
      service = testbed.get(MspLog2Service);
      httpMock = injector.get(HttpTestingController);

    }));

    it('Calling the MSPLog2 Service API', () => {

        const mockResponse = { message: Object({ event: 'submission', dateObj: new Date() }) };

        const serviceResponse = service.log({
            event: 'submission',
            dateObj: new Date()
        });

        const req = httpMock.expectOne(environment.appConstants.logBaseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockResponse);
        expect(req.request.url ).toBe(environment.appConstants.logBaseUrl);

        req.flush(mockResponse);
      });
  });


