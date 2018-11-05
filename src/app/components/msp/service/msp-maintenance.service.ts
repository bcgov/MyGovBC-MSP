import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { _ApplicationTypeNameSpace } from "../api-model/applicationTypes";
import { ISpaEnvResponse } from '../model/spa-env-response.interface';
import { MspLog2Service } from './log2.service';
import * as moment from 'moment';
import { AbstractHttpService } from './abstract-api.service';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs';

/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 *
 * Subscribe to SpaEnvService.values() to get the env values.
 */
@Injectable({
  providedIn: 'root'
})

export class  MspMaintenanceService extends AbstractHttpService {
    
    protected _headers: HttpHeaders = new HttpHeaders({
        'SPA_ENV_NAME': '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}',
        'program': 'msp',
        'timestamp' : moment().toISOString(),
        'method': 'checkMaintenance',
        'severity': 'info',
    });
    
    constructor(protected http: HttpClient, private logService: MspLog2Service) {
        super(http);  
    }

    checkMaintenance(): Observable<ISpaEnvResponse> {
        const url = environment.appConstants['envServerBaseUrl'];
        return this.post<ISpaEnvResponse>(url, null);
    }
    
    protected handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occured
            console.error('MspMaintenanceService error: ', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code
            console.error(`MspMaintenanceService Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }
        this.logService.log({event: 'error', key: 'Cannot get maintenance flag from spa-env-server'});
        
        // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
        return of([]);
    }
    
    protected _headers: HttpHeaders = new HttpHeaders({
    });
}