/* tslint:disable:no-unused-variable */
import {
    JsonpModule,
    Jsonp,
    BaseRequestOptions,
    Response,
    ResponseOptions,
    Http
} from "@angular/http";
import {TestBed, getTestBed, inject} from '@angular/core/testing';
import {MspMaintenanceService} from './msp-maintenance.service';
import {MspLogService} from './log.service';
import { MspLog2Service } from './log2.service';
import {MspDataService} from './msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ISpaEnvResponse} from '../components/msp/model/spa-env-response.interface';

describe('MspMaintenanceService', () => {
    let injector: TestBed;
    let service: MspMaintenanceService;
    let httpMock: HttpTestingController;
    let spaEnvRes: ISpaEnvResponse;
    const log2ServiceStub = () => ({});

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          HttpClientModule,
          RouterTestingModule,
          FormsModule,
          LocalStorageModule.withConfig({
            prefix: 'ca.bc.gov.msp',
            storageType: 'sessionStorage'
          })
        ],
        providers: [
          LocalStorageService,
          MspMaintenanceService,
          MspLogService,
          MspDataService,
          { provide: MspLog2Service, useFactory: log2ServiceStub }
        ]
      });
      injector = getTestBed();
      service = injector.get(MspMaintenanceService);
      httpMock = injector.get(HttpTestingController);
    });

    it('should be created', inject([MspMaintenanceService], (service: MspMaintenanceService) => {
      expect(service).toBeTruthy();
    })); 
   /* it('Calling the Maintenance API', () => {
        const dummyResponse = [
          {"SPA_ENV_MSP_MAINTENANCE_FLAG":"false", "SPA_ENV_MSP_MAINTENANCE_MESSAGE":"MSP System will be down from Time A to Time B"}];
        this.spaEnvRes = service.checkMaintenance();
        const req = httpMock.expectOne('/env');
        expect(req.request.method).toBe("POST");
        req.flush(dummyResponse);
      });
      */

  });


