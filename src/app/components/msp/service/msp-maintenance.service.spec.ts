/* tslint:disable:no-unused-variable */
import {
    JsonpModule,
    Jsonp,
    BaseRequestOptions,
    Response,
    ResponseOptions,
    Http
} from "@angular/http";
import {TestBed, getTestBed, fakeAsync, tick} from '@angular/core/testing';
import {MspMaintenanceService} from './msp-maintenance.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ISpaEnvResponse} from '../model/spa-env-response.interface';

describe('MspMaintenanceService', () => {
    let injector: TestBed;
    let service: MspMaintenanceService;
    let httpMock: HttpTestingController;
    let spaEnvRes: ISpaEnvResponse;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [MspMaintenanceService]
      });
      injector = getTestBed();
      service = injector.get(MspMaintenanceService);
      httpMock = injector.get(HttpTestingController);
    });

    it('should return an Observable<R>', () => {
        const dummyResponse = [
          {"SPA_ENV_MSP_MAINTENANCE_FLAG":"false", "SPA_ENV_MSP_MAINTENANCE_MESSAGE":"MSP System will be down from Time A to Time B"}];
        
        this.spaEnvRes = service.checkMaintenance();
        const req = httpMock.expectOne('/env');
        expect(req.request.method).toBe("POST");
        req.flush(dummyResponse);
      });

  });


