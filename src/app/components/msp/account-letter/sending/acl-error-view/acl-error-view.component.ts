import {AfterContentInit, ChangeDetectorRef, Component, Input, OnInit,SimpleChanges,Output,EventEmitter} from '@angular/core';
import {ACLApiResponse} from "../../../model/account-letter-response.interface";
import {Person} from "../../../model/person.model";
import {MspACLService} from "../../../service/msp-acl-api.service";
import {MspDataService} from "../../../service/msp-data.service";
import {MspLogService} from "../../../service/log.service";
import {Router} from "@angular/router";
import {ProcessService} from "../../../service/process.service";
import {BaseComponent} from "../../../common/base.component";
import {HttpErrorResponse} from '@angular/common/http';

/*
this component is to abstract all the Error related details for ACL.
such as  RAPID error codes has to be sent to SPA_ENV etc
 */
@Component({
    selector: 'msp-acl-error-view',
    templateUrl: './acl-error-view.component.html',
    styleUrls: ['./acl-error-view.component.scss']
})
export class AclErrorViewComponent extends BaseComponent{
    lang = require('./i18n');

    @Input()response: ACLApiResponse;

    public rapidError: string;

    @Output() stopProcessing = new EventEmitter<string>();

    doneProcessing = false;

    constructor(private aclService: MspACLService, private cd: ChangeDetectorRef ,private router: Router, private logService: MspLogService) {
        super(cd);
    }

    ngOnChanges(changes: SimpleChanges) {
        // RAPID Response..GOTO SPA_ENV server and get the user message
        if (changes&& changes.response && changes.response.currentValue && changes.response.currentValue.rapidResponse && changes.response.currentValue.rapidResponse != 'N') {
            const spaRapidHeader = '{"SPA_ENV_MSP_ACL_'+this.response.rapidResponse+'":""}';
            this.aclService
                .sendSpaEnvServer(spaRapidHeader)
                .subscribe(response => {
                    if (response instanceof HttpErrorResponse) { // probable network errors..Spa Env server could be down
                        this.logService.log({
                            name: 'ACL - SPA Env System Error'
                        }, 'ACL - SPA Env Rapid Response Error' + response.message);
                        this.stopSpinner();
                        return;
                    }
                    var key = Object.keys(response)[0];
                    this.rapidError = response[key];
                    this.stopSpinner();
                });
        } else {
           this.stopSpinner()
        }
    }


    stopSpinner() {
        this.stopProcessing.emit();
        this.doneProcessing = true;
    }

    retrySubmission() {
        this.router.navigate(['/msp/account-letter/personal-info']);
    }

}
