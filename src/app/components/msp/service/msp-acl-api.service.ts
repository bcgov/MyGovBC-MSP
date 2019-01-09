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
    
    
    constructor(protected http: HttpClient, private logService: MspLogService) {
        super(http);  
    }

    sendAccountLetterApp(AccountLetterJsonResponse: AccountLetterType, uuid: string): Observable<AccountLetterType> {
        const url = environment.appConstants['apiBaseUrl']
                + '/MSPDESubmitApplication/' + uuid;
                + '?programArea=accountLetter';

        return this.post<AccountLetterType>(url, AccountLetterJsonResponse);
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
        //this.logService.log({event: 'error', key: 'Cannot get maintenance flag from spa-env-server'});
        
        // A user facing erorr message /could/ go here; we shouldn't log dev info through the throwError observable
        return of(error);
    }
    
    protected _headers: HttpHeaders = new HttpHeaders({
        'program': 'MSP-ACL',
        'timestamp' : moment().toISOString(),
        'method': 'sendAccountLetterApp',
        'severity': 'info',
        'Content-Type': 'application/json',
        'Response-Type': 'application/json',
    });


    // Added by Abhi This method is used to convert the response from user into a JSOn object
    public convertAccountLetterApp(from: AccountLetterApplication): AccountLetterType {
        const to = AccountLetterApplicantTypeFactory.make();
		to.AclTransactionId = from.uuid;
        to.RequesterPostalCode  = from.postalCode;
        to.RequesterPHN = from.applicant.previous_phn;
        to.RequesterBirthdate = from.applicant.dob_month+'-'+from.applicant.dob_day+'-'+from.applicant.dob_year;

        if(from.applicant.enrollmentMember == '0') {
            to.LetterSelection = 'M';
        } else if(from.applicant.enrollmentMember == '1') {
            to.LetterSelection = 'A';
        } else if(from.applicant.enrollmentMember == '2') {
            to.LetterSelection = 'S';
            to.SpecificPHN = from.applicant.specificMember_phn;
        }

        to.Valid = 'Y';
        console.log(from);
        return to;
    }
}