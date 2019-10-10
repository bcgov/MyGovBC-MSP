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
import { AclApiPayLoad } from '../modules/request-acl/model/acl-api.model';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor  {

  constructor( private fakebackendService: FakeBackendService ) { }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    // wrap in delayed observable to simulate server api call
    return of(null).pipe( mergeMap(() => {

      console.log( 'Request (fakeBackend interceptor)', request );

      if ( 'POST' === request.method ) {
        let payload = null;

        if (request.url.includes('/accLetterIntegration')) {
          console.log( 'Fake-backend for accLetterIntegration' );
          payload = this.getAclResponse( request );
        }

        if ( payload ) {
          return of(new HttpResponse({ status: 200, body: payload }))
            .pipe(delay(1000));
        }
      }

      // Pass through to actual service
      return next.handle( request );
    }));
  }

  private getAclResponse( request: HttpRequest<any> ): AclApiPayLoad {

    return {
      aclTransactionId: request.body.aclTransactionId,
      referenceNumber: '1535785',
      dberrorMessage: null,
      rapidResponse: 'Y',
      dberrorCode: 'Y'
    };
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

