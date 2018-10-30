import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { _ApplicationTypeNameSpace } from "../api-model/applicationTypes";
import { ISpaEnvResponse } from '../model/spa-env-response.interface';
import { MspLogService } from './log.service';
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
    
    constructor(protected http: HttpClient, private logService: MspLogService) {
        super(http);  
    }

    checkMaintenance(): Observable<ISpaEnvResponse> {
        const url = environment.appConstants['envServerBaseUrl'];
        const envName = '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}';
        
        return this.post<ISpaEnvResponse>(url, {
            'program': 'msp',
            'timestamp' : moment().toISOString(),
            'method': 'checkMaintenance',
            'severity': 'info',
            'SPA_ENV_NAME': envName
        });
    }
    
    protected handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occured
            console.error('An error occured: ', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code
            console.error(`Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }
        
        this.logService.log({
            text: 'Cannot get maintenance flag from spa-env-server',
            response: error,
        }, 'Cannot get maintenance flag from spa-env-server');
        
        // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
        return of([]);
    }
    
    protected _headers: HttpHeaders = new HttpHeaders({
    });
}