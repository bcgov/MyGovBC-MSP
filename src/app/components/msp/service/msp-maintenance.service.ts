import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { MspDataService } from "./msp-data.service";
import { environment } from '../../../../environments/environment';
import * as moment from "moment";
import { AccountChangeAccountHolderFactory, AccountChangeAccountHolderType, AccountChangeApplicationTypeFactory, AccountChangeChildType, AccountChangeChildTypeFactory, AccountChangeChildrenFactory, AccountChangeSpouseType, AccountChangeSpouseTypeFactory, AccountChangeSpousesTypeFactory, OperationActionType } from "../api-model/accountChangeTypes";
import { ApplicationTypeFactory, AttachmentType, AttachmentTypeFactory, AttachmentsType, AttachmentsTypeFactory, DocumentFactory, _ApplicationTypeNameSpace, document } from "../api-model/applicationTypes";
import { AssistanceApplicantTypeFactory, AssistanceApplicationTypeFactory, AssistanceSpouseTypeFactory, FinancialsType, FinancialsTypeFactory } from "../api-model/assistanceTypes";
import { AddressType, AddressTypeFactory, AttachmentUuidsType, AttachmentUuidsTypeFactory, BasicCitizenshipTypeFactory, CitizenshipType, GenderType, NameType, NameTypeFactory } from "../api-model/commonTypes";
import { DependentType, DependentTypeFactory, EnrolmentApplicantTypeFactory, EnrolmentApplicationTypeFactory, EnrolmentChildrenTypeFactory, EnrolmentDependentsTypeFactory, LivedInBCTypeFactory, OutsideBCTypeFactory, PersonType, PersonTypeFactory, PreviousCoverageTypeFactory, ResidencyType, ResidencyTypeFactory, WillBeAwayTypeFactory } from "../api-model/enrolmentTypes";
import { ResponseType } from "../api-model/responseTypes";
import { ApplicationBase } from "../model/application-base.model";
import { MspApplication } from "../model/application.model";
import { MspLogService } from './log.service';
import {ISpaEnvResponse} from '../model/spa-env-response.interface';
const jxon = require('jxon/jxon');


@Injectable()
export class MspMaintenanceService  {

    spaResponse: ISpaEnvResponse;    
    
    constructor(private http: HttpClient) {
                
    }  

    init(): void {
      console.log("Initiating the service");
    }
    
    checkMaintenance(): Promise<ResponseType> {
        const token = '5993117a-2384-4b70-ad42-1e9b9e6044d9';
        const envName = '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}';
         
        return new Promise<ResponseType>((resolve, reject) => {
			
			// Getting the url
            let url = environment.appConstants['envServerBaseUrl']
            
            // Setup headers
            let headers = new HttpHeaders({
                'SPA_ENV_NAME': envName,
                'Authorization': 'spaenv ' + token
               
            });
			
			// Setting the options for the rest call 
            let options = {headers: headers,responseType: "text" as "text"};
            return this.http.post(url, null, options)
                .toPromise()
                .then((response: string) => {
                        console.log("SPA Environment Response "+response);
                        return resolve(JSON.parse(response));
                    },
                    (error: Response | any) => {
                        console.log('error response in its origin form: ', error);
                        return error;
                    }
                )
                .catch((error: Response | any) => {
                    console.log("Error when calling the MSP Maintenance: ", error);
                    /*this.logService.log({
                    //    text: "MSP Maintenance API - Error ",
                        response: error,
                    }, "")
                    let response = this.convertResponse(error);
                    reject(response || error);*/
                    return error;
                });
        });
    }
}