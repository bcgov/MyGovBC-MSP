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
import { MspLog2Service } from '../../service/log2.service';
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

  public spaEnvRes: ISpaEnvResponse = {} as any;
  
  constructor(protected http: HttpClient,  private logService: MspLog2Service, private maintenanceService: MspMaintenanceService) {
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
    this.spaEnvRes = <ISpaEnvResponse> response;
    console.log("=====MSP Maintenance Flag==="+this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG+'----'+this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE);
    }, (error: Response | any) => {
      console.log('Error when calling the MSP Maintenance: '+error);
      console.log(this.logService.log({event: 'error', key: 'Error when calling the Maintenance API'}));
      this.logService.log({event: 'error', key: 'Error when calling the Maintenance API'});
    });
  }
}
