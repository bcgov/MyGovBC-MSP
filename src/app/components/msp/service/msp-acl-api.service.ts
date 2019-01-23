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
import { AccountLetterApplication } from '../model/account-letter-application.model';
import { AccountLetterApplicantTypeFactory, AccountLetterType  } from '../api-model/accountLetterTypes';


/**
 * Responsible for retrieving values from the spa-env-server on OpenShift.
 *
 * Subscribe to SpaEnvService.values() to get the env values.
 */
@Injectable({
  providedIn: 'root'
})

export class MspACLService extends AbstractHttpService {

    protected _headers: HttpHeaders = new HttpHeaders();

    constructor(protected http: HttpClient, private logService: MspLogService) {
        super(http);  
    }

    sendAccountLetterApp(accountLetterApplication: AccountLetterApplication, uuid: string): Observable<AccountLetterType> {
        console.log("Trying to hit---------------accLetterIntegration-----------------");
        const accountLetterJsonResponse = this.convertAccountLetterApp(accountLetterApplication);
        const url = environment.appConstants['apiBaseUrl']
                    + '/accLetterIntegration/rest/callRapid';
                + '?programArea=accountLetter';
        // Setup headers
        this._headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Response-Type': 'application/json',
            'X-Authorization': 'Bearer ' + accountLetterApplication.authorizationToken,
        });

        return this.post<AccountLetterType>(url, accountLetterJsonResponse );
    }
    
    protected handleError(error: HttpErrorResponse) {
        console.log("handleError", JSON.stringify(error));
        if (error.error instanceof ErrorEvent) {
            //Client-side / network error occured
            console.error('MspMaintenanceService error: ', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code
            console.error(`MspMaintenanceService Backend returned error code: ${error.status}.  Error body: ${error.error}`);
        }
        //this.logService.log({event: 'error', key: 'Cannot get maintenance flag from spa-env-server'});
        
        // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
        return of(error);
    }
    



    // Added by Abhi This method is used to convert the response from user into a JSOn object
    private convertAccountLetterApp(from: AccountLetterApplication): AccountLetterType {
        const to = AccountLetterApplicantTypeFactory.make();
        to.AclTransactionId = from.uuid;
        to.RequesterPostalCode  = from.postalCode.toUpperCase().replace(' ', '');;
        to.RequesterPHN = from.applicant.previous_phn;

        to.RequesterBirthdate = from.applicant.dob.format(this.ISO8601DateFormat); ;

        switch (from.applicant.enrollmentMember ) {
            case '0' :
                to.LetterSelection = 'M';
                break;
            case '1' :
                to.LetterSelection = 'A';
                break;
            case '2' :
                to.LetterSelection = 'S';
                to.SpecificPHN = from.applicant.specificMember_phn;
                break;
        }

        to.Valid = 'Y';
        console.log(from);
        return to;
    }
    readonly ISO8601DateFormat = 'YYYY-MM-DD';
}