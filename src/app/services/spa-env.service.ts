import { Injectable } from '@angular/core';
import { AbstractHttpService } from 'moh-common-lib';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { MspLogService } from './log.service';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { retry, filter } from 'rxjs/operators';

/**
 * The list of all server envs we expect back from the spa-env-server. By adding
 * a value here it'll both be retrieved from the server, and the type/interface
 * will be updated.
 */
const serverEnvs = {
  SPA_ENV_ENABLE_ADDRESS_VALIDATOR: '',
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
export class SpaEnvService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders({
    SPA_ENV_NAME: stringifiedEnvs,
  });

  public _values = new BehaviorSubject<SpaEnvResponse>( null );
  /** The values retrieved from the SpaEnv server. */
  public values: Observable<SpaEnvResponse> = this._values.asObservable()
    .pipe(filter(x => !!x)); // filter null response out, init value

  constructor(protected http: HttpClient, private logService: MspLogService) {
    super(http);
  }

  public getValues(): SpaEnvResponse {
    return this._values.getValue();
  }

  public loadEnvs(){
    const url = environment.appConstants.envServerBaseUrl;

    // When the SpaEnv server is being deployed it can return an HTML error
    // page, and it should resolve shortly, so we try again.
    return this.post<SpaEnvResponse>(url, null).pipe(retry(3));
  }

  protected handleError(error: HttpErrorResponse) {
    console.log( 'Error handleError: ', error );

    if (error.error instanceof ErrorEvent) {
      //Client-side / network error occured
      console.error('An error occured: ', error.error.message);
    }
    else {
      // The backend returned an unsuccessful response code
      console.error(`Backend returned error code: ${error.status}.  Error body: ${error.error}`);
    }

    this.logService.log(error, 'Error');

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return throwError('Something went wrong with the network request.');
  }

}
