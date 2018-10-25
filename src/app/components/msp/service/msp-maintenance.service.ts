import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from "@angular/core";
import { environment } from '../../../../environments/environment';
import { ApplicationTypeFactory, AttachmentType, AttachmentTypeFactory, AttachmentsType, AttachmentsTypeFactory, DocumentFactory, _ApplicationTypeNameSpace, document } from "../api-model/applicationTypes";
import { ResponseType } from "../api-model/responseTypes";
import {ISpaEnvResponse} from '../model/spa-env-response.interface';
import { MspLogService } from './log.service';
const jxon = require('jxon/jxon');


@Injectable()
export class MspMaintenanceService  {

    constructor(private http: HttpClient, private logService: MspLogService) {
                
    }  

    init(): void {
      console.log("Initiating the service");
    }
    
    checkMaintenance(): Promise<ISpaEnvResponse> {
        let spaResponse: ISpaEnvResponse;  

        return new Promise<ISpaEnvResponse>((resolve, reject) => {
			
			// Getting the url
            let url = environment.appConstants['envServerBaseUrl']
            const envName = '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}';
            
            // Setup headers
            let headers = new HttpHeaders({
                'SPA_ENV_NAME': envName
            });
			
			// Setting the options for the rest call 
            let options = {headers: headers,responseType: "text" as "text"};
            return this.http.post(url, null, options)
                .toPromise()
                .then((response: string) => {
                        console.log("SPA Environment Response "+response);
                        //return resolve(JSON.parse(response));
                        spaResponse = <ISpaEnvResponse> JSON.parse(response);
                        return resolve(spaResponse);
                    },
                    (error: Response | any) => {
                        console.log('Unable to get the proper response from the SPA Maintenance API: ', error);
                        return resolve(error);
                    }
                )
                .catch((error: Response | any) => {
                    console.log("Error when calling the MSP Maintenance: ", error);
                    this.logService.log({
                        text: "Error when calling the Maintenance Service. Unable to connect to the API",
                        response: error,
                    }, "")
                    return resolve(error);
                });
        });
    }


}