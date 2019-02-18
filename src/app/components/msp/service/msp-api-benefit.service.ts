import { Injectable } from '@angular/core';
import {MspLogService} from './log.service';
import {HttpClient} from '@angular/common/http';
import {MspMaintenanceService} from './msp-maintenance.service';
import {ApplicationBase} from '../model/application-base.model';

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
}
