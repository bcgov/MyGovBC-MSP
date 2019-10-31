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
import { environment } from '../../environments/environment';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor  {

  constructor( private fakebackendService: FakeBackendService ) { }

  intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

    // wrap in delayed observable to simulate server api call
    return of(null).pipe( mergeMap(() => {

      console.log( 'Request (fakeBackend interceptor)', request );

      if ( 'POST' === request.method ) {
        let payload = null;

        console.log( 'Post method' );

        if (request.url.includes( environment.appConstants.aclContextPath )) {
          console.log( 'Fake-backend for accLetterIntegration' );
          payload = this.fakebackendService.getAclResponse( request );
        }

        if (request.url.includes( environment.appConstants.attachment )) {
          console.log( 'Fake-backend for attachements' );
          payload = this.fakebackendService.getAttachementResponse( request );
        }

        if (request.url.includes( environment.appConstants.suppBenefitAPIUrl )) {
          console.log( 'Fake-backend for submit application' );
          payload = this.fakebackendService.getSubmitApplicationResponse( request );
        }

        if ( payload ) {

          console.log( 'Sending reponse from fake-backend' );
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

