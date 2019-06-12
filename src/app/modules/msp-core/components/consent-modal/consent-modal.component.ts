import {Component, EventEmitter, Input, Output, ViewChild, Inject} from '@angular/core';
import * as moment from 'moment';
import {ModalDirective} from 'ngx-bootstrap';
import {ApplicationBase} from '../../../enrolment/models/application-base.model';
// jam - trying to inject appConstants
//
import { HttpClient, HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MspMaintenanceService } from "../../../../services/msp-maintenance.service";
import { Response } from '@angular/http';
import { MspLog2Service } from '../../../../services/log2.service';
import { MspLogService } from '../../../../services/log.service';
import {MspACLService} from "../../../account-letter/services/msp-acl-api.service";
import {ISpaEnvResponse} from '../../../../components/msp/model/spa-env-response.interface'


@Component({
    selector: 'msp-consent-modal',
    templateUrl: './consent-modal.component.html',
    // providers: []
})
export class MspConsentModalComponent {
    lang = require('./i18n');

    @Input() processName: string;
    @Input() body: string = this.lang('./en/index.js').body;
    @Input() application: ApplicationBase;
    @ViewChild('fullSizeViewModal') public fullSizeViewModal: ModalDirective;
    @Output() onClose = new EventEmitter<void>();
    @Output() cutOffDate: EventEmitter<ISpaEnvResponse> = new EventEmitter<ISpaEnvResponse>();

    public spaEnvRes: ISpaEnvResponse = {} as any;
    public maintenanceFlag: string ;
    public maintenanceMessage: string;

    private _applicationHeaderMap:Map<string, string> = new Map([["ACL", '{"SPA_ENV_MSP_ACL_MAINTENANCE_FLAG":"","SPA_ENV_MSP_ACL_MAINTENANCE_MESSAGE":""}'], ["MSP", '{"SPA_ENV_MSP_MAINTENANCE_FLAG":"","SPA_ENV_MSP_MAINTENANCE_MESSAGE":""}'],["PA", '{"SPA_ENV_PACUTOFF_MAINTENANCE_START":"","SPA_ENV_PACUTOFF_MAINTENANCE_END":"","SPA_ENV_NOW":""}']]);

    
    constructor(private aclService: MspACLService, protected http: HttpClient,  private logService: MspLogService, private maintenanceService: MspMaintenanceService) {
        
    }

    ngOnInit(): void {
        //Called after ngOnInit when the component's or directive's content has been initialized.
        //Add 'implements AfterContentInit' to the class.
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
        this.aclService
            .sendSpaEnvServer(this._applicationHeaderMap.get(this.processName))
                .subscribe(response => {
                    this.spaEnvRes = <ISpaEnvResponse> response;
                    if(this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_FLAG == 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_ACL_MAINTENANCE_MESSAGE; 
                    } else if (this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_FLAG == 'true') {
                        this.maintenanceFlag = 'true';
                        this.maintenanceMessage = this.spaEnvRes.SPA_ENV_MSP_MAINTENANCE_MESSAGE;
                    }
                    if(this.spaEnvRes.SPA_ENV_PACUTOFF_MAINTENANCE_START) {
                        this.cutOffDate.emit(this.spaEnvRes);;
                    }
                    
			}, (error: Response | any) => {
                console.log('Error when calling the MSP Maintenance: '+error);
                this.logService.log({
                    name: 'ACL - SPA Env System Error'
                }, 'ACL - SPA Env Rapid Response Error' +error);
             
            });
    }

    
}