import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '../../../../environments/environment';
import { _ApplicationTypeNameSpace } from "../api-model/applicationTypes";
import { ISpaEnvResponse } from '../model/spa-env-response.interface';
import { MspLogService } from './log.service';
import * as moment from 'moment';
import { AbstractHttpService } from './abstract-api.service';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { tap, retry } from 'rxjs/operators';
import { of } from 'rxjs';



/**
 * The list of all server envs we expect back from the spa-env-server. By adding
 * a value here it'll both be retrieved from the server, and the type/interface
 * will be updated.
 */
const serverEnvs = {
  SPA_ENV_MSP_MAINTENANCE_FLAG: '',
  SPA_ENV_MSP_MAINTENANCE_MESSAGE: '',
};

// Used in HTTP request
const stringifiedEnvs = JSON.stringify(serverEnvs);

/**
 * All the serverEnvs, provided as an object, converted to a type which we can
 * use as an interface or for responses.  By doing it this way, we can
 * accomplish **both** of the following without duplication:
 *
 * 1. Automatically added to the HTTP request
 * 2. Added to the type/interface
 *
 * Thus, we're updating types and modifying runtime behaviour in one stroke.
 */
export type SpaEnvResponse = typeof serverEnvs;


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
        SPA_ENV_NAME: stringifiedEnvs,
    });

    constructor(protected http: HttpClient, private logService: MspLogService) {
        super(http);  
    }

    protected handleError(error: HttpErrorResponse) {
        console.log( 'Cannot get maintenance flag from spa-env-server:: ', error );
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occured
            console.error('An error occured: ', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code
            console.error(`Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }
        
        //this.logService.logHttpError(error);
        // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
        return of([]);
    }

    checkMaintenance(): Observable<ISpaEnvResponse> {
        const url = environment.appConstants['envServerBaseUrl'];
        
        return this.post<ISpaEnvResponse>(url, {
            'program': 'msp',
            'timestamp' : moment().toISOString(),
            'method': 'checkMaintenance',
            'severity': 'info'
        });
    }
    
}