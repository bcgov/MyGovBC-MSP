import { Injectable } from '@angular/core';
import { AbstractHttpService } from 'moh-common-lib';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { AclApplication } from '../model/acl-application.model';
import { environment } from '../../../../environments/environment';
import { AclApiPayLoad } from '../model/acl-api.model';
import { EnrolmentMembership } from '../model/enrolment-membership.enum';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class AclApiService extends AbstractHttpService {

  protected _headers: HttpHeaders = new HttpHeaders();

  private readonly ISO8601DateFormat = 'YYYY-MM-DD';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  // Send request for account confirmation letter
  sendAclRequest( application: AclApplication ) {
    const url = environment.appConstants.apiBaseUrl +
                environment.appConstants.aclContextPath +
                application.uuid;

    // Setup header
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Response-Type': 'application/json',
      'X-Authorization': 'Bearer ' + application.authorizationToken,
    });

    const dob = moment( {
      year: application.accountHolderDob.year,
      month: application.accountHolderDob.month - 1, // Months are zero based
      day: application.accountHolderDob.day
      } );

    return this.post<AclApiPayLoad>( url,
      {
        requesterPHN: application.accountHolderPhn.replace(/ /g, ''),
        requesterBirthdate: dob.format( this.ISO8601DateFormat ),
        requesterPostalCode: application.postalCode.toUpperCase().replace(/ /g, ''),
        letterSelection: application.enrolmentMembership,
        specificPHN: (application.enrolmentMembership !== EnrolmentMembership.SpecificMember) ?
                     '' : application.specificMemberPhn.replace(/ /g, ''),
        aclTransactionId: application.uuid
    } );
  }

  /** Handles all failed requests that throw either a server error (400/500) or a client error (e.g. lost internet). */
  protected handleError( error: HttpErrorResponse ) {

    console.log('handleError', JSON.stringify(error));
    if ( error.error instanceof ErrorEvent ) {
      // Client-side / network error occured
      console.error( 'MspMaintenanceService error: ', error.error.message );
    } else {
      // The backend returned an unsuccessful response code
      console.error( `MspMaintenanceService Backend returned error code: ${error.status}.  Error body: ${error.error}`);
    }

    // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
    return of(error);
  }
}
