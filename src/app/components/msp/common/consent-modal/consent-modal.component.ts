import {Component, EventEmitter, Input, Output, ViewChild, Inject} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';
import {ApplicationBase} from '../../model/application-base.model';
// jam - trying to inject appConstants
//
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MspMaintenanceService } from "../../service/msp-maintenance.service";
import { Http, Response } from '@angular/http';
import {ISpaEnvResponse} from '../../model/spa-env-response.interface';
import { ResponseType } from '../../api-model/responseTypes';


@Component({
  selector: 'msp-consent-modal',
  templateUrl: './consent-modal.component.html',
  // providers: []
})
export class MspConsentModalComponent {
  lang = require('./i18n');

  @Input() processName: string;
 // maintenanceService : MspMaintenanceService;
  http: HttpClient;
  @Input() application: ApplicationBase;
  @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
  @Output() onClose = new EventEmitter<void>();

  public appConstants;
  public spaEnvRes: ISpaEnvResponse;

  constructor(private maintenanceService: MspMaintenanceService) {
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
    this.maintenanceService.checkMaintenance()
      .then((response: any) => {
        this.spaEnvRes = <ISpaEnvResponse> response;
        console.log("=====MSP Maintenance==="+this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG+'----'+this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE);
        this.appConstants.mspIsInMaintenanceFlag = this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG === "true" ? true: false;
        this.appConstants.mspIsInMaintenanceText = this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
      },
      (error: Response | any) => {
        this.appConstants.mspIsInMaintenanceFlag = false;
        console.log('error application resolved'+error);
      }
    );

  }
}
