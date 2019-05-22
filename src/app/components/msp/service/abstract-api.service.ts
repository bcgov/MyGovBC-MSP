import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


/**
 * Abstract class for HTTP Service
 */
export abstract class AbstractHttpService {

  protected logHTTPRequestsToConsole: boolean = false;

  constructor(protected http: HttpClient) {}

  /** The headers to send along with every GET and POST. */
  protected abstract _headers: HttpHeaders;

  /**
   * Makes a GET request to the specified URL, using headers and HTTP options specified in their respective methods.
   * @param url Target URL to make the GET request
   */
  protected get<T>(url, queryParams?: HttpParams): Observable<T> {
    /** The HTTP request observer with always on error handling */
    const httpOpts = this.httpOptions;
    httpOpts.params = queryParams ? queryParams : undefined;
    const observable = this.http.get(url, httpOpts);
    return this.setupRequest(observable);
  }

  protected post<T>(url, body): Observable<T> {
    if (this.logHTTPRequestsToConsole) {
      console.log( 'Post Request: ', body );
    }
    const observable = this.http.post(url, body, this.httpOptions);
    return this.setupRequest(observable);
  }

  protected setupRequest<T>(observable: Observable<any> ): Observable<T> {
    // All failed requests should trigger the abstract method handleError
    observable = observable.pipe(catchError(this.handleError.bind(this)));
    // Optionally add console logging
    if (this.logHTTPRequestsToConsole) {
      observable = observable.pipe(tap(
        data => console.log('HTTP Success: ', data),
        error => console.log('HTTP Error: ', error)
      ));
    }
    return observable;
  }

  /** The HttpOptions object that Angular takes for GET and POST requests. Used in every HTTP request from this service. */
  protected get httpOptions(): {headers: HttpHeaders, params?: HttpParams} {
    return {
      headers: this._headers
    };
  }

  /** Handles all failed requests that throw either a server error (400/500) or a client error (e.g. lost internet). */
  protected abstract handleError(error: HttpErrorResponse);
}
