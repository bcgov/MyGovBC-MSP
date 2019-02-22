import { Injectable } from '@angular/core';
import {MspLogService} from './log.service';
import {HttpClient} from '@angular/common/http';
import {MspMaintenanceService} from './msp-maintenance.service';
import {ApplicationBase} from '../model/application-base.model';
import { BenefitApplication } from '../model/benefit-application.model';
import { AccountLetterApplicantTypeFactory, AccountLetterType  } from '../api-model/accountLetterTypes';


@Injectable({
  providedIn: 'root'
})
//TODO - nothing has been done on these service except the skeleton.
// This service should handle the hitting of the middleware
export class MspApiBenefitService {

    constructor(private http: HttpClient, private logService: MspLogService, private maintenanceService: MspMaintenanceService) {
    }

    sendApplication(app: ApplicationBase): Promise<ApplicationBase> {
      return ;
    }

    // This method is used to convert the response from user into a JSON object
    private convertAccountLetterApp(from: BenefitApplication): AccountLetterType {
      const to = AccountLetterApplicantTypeFactory.make();
      to.aclTransactionId = from.uuid;
     // to.requesterPostalCode  = from.postalCode.toUpperCase().replace(' ', '');
      to.requesterPHN = from.applicant.previous_phn.replace(/\s/g, "");
     // to.requesterBirthdate = from.applicant.dob.format(this.ISO8601DateFormat);
     
     /* switch (from.applicant.enrollmentMember ) {
          
          case MSPEnrollementMember.MyselfOnly :
              to.letterSelection = 'M';
              break;

          case MSPEnrollementMember.AllMembers :
              to.letterSelection = 'A';
              break;

          case MSPEnrollementMember.SpecificMember :
              to.letterSelection = 'S';
              to.specificPHN = from.applicant.specificMember_phn.replace(/\s/g, "");
              break;
      }*/

     // to.Valid = 'Y';
      return to;
  }
}
