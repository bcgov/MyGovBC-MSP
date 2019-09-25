import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { mergeMap, delay } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Injectable } from '@angular/core';
import { FakeBackendService } from './fake-backend.service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor  {

  constructor( private fakebackendService: FakeBackendService ) { }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    // wrap in delayed observable to simulate server api call
    return of(null).pipe( mergeMap(() => {

      console.log( 'Request (fakeBackend interceptor)', request );

      if ( 'POST' === request.method ) {
        const payload = null;

        if ( payload ) {
          return of(new HttpResponse({ status: 200, body: payload }))
            .pipe(delay(1000));
        }
      }

      // Pass through to actual service
      return next.handle( request );
    }));
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

