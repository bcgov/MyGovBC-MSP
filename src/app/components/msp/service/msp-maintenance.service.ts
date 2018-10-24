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

    spaResponse: ISpaEnvResponse;    
    
    constructor(private http: HttpClient, private logService: MspLogService) {
                
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
                    this.logService.log({
                    //    text: "MSP Maintenance API - Error ",
                        response: error,
                    }, "")
                    let response = this.convertResponse(error);
                    reject(response || error);
                    return error;
                });
        });
    }

    convertResponse(responseBody: string): ResponseType {
        return this.stringToJs<ResponseType>(responseBody)['ns2:response'];
    }

    stringToJs<T>(from: string): T {
        const converted = jxon.stringToJs(from) as T;
        return converted;
    }
}