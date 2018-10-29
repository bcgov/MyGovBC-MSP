import {Component, EventEmitter, Input, Output, ViewChild, Inject} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';
import {ApplicationBase} from '../../model/application-base.model';
// jam - trying to inject appConstants
//
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MspMaintenanceService } from "../../service/msp-maintenance.service";
import { Response } from '@angular/http';
import { MspLogService } from '../../service/log.service';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface'

@Component({
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html',
  // providers: []
})
export class MspConsentModalComponent {
  lang = require('./i18n');

  @Input() processName: string;
  @Input() application: ApplicationBase;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();

  public appConstants;

  constructor(protected http: HttpClient,  private logService: MspLogService, private maintenanceService: MspMaintenanceService) {
    this.appConstants = environment.appConstants;
    this.inMaintenance();
  }

  agreeCheck: boolean = false;

  showFullSizeView(){
    this.fullSizeViewModal.config.backdrop = false;
    this.fullSizeViewModal.config.keyboard = false;
    this.fullSizeViewModal.show();
  }

  continue() {
    this.application.infoCollectionAgreement = true;
    this.fullSizeViewModal.hide();
    this.onClose.emit();
  }
  
  inMaintenance() {
    this.maintenanceService.checkMaintenance().subscribe(response => {
      const spaResponse = <ISpaEnvResponse> response;
      console.log("=====MSP Maintenance Flag==="+spaResponse.SPA_ENV_MSP_MAINTENANCE_FLAG+'----'+spaResponse.SPA_ENV_MSP_MAINTENANCE_MESSAGE);
      this.appConstants.mspIsInMaintenanceFlag = spaResponse.SPA_ENV_MSP_MAINTENANCE_FLAG === "true" ? true: false;
      this.appConstants.mspIsInMaintenanceText = spaResponse.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
    },
    (error: Response | any) => {
      this.appConstants.mspIsInMaintenanceFlag = false;
      console.log('Error when calling the MSP Maintenance: '+error);
      this.logService.log({
        text: "Error when calling the MSP Maintenance:",
        response: error,
      }, "");
    });
  }
}
