import {AfterContentInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ACLApiResponse} from "../../../model/account-letter-response.interface";
import {Person} from "../../../model/person.model";
import {MspACLService} from "../../../service/msp-acl-api.service";
import {MspDataService} from "../../../service/msp-data.service";
import {MspLogService} from "../../../service/log.service";
import {Router} from "@angular/router";
import {ProcessService} from "../../../service/process.service";
import {BaseComponent} from "../../../common/base.component";
import {Subject} from 'rxjs/internal/Subject';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'msp-acl-error-view',
    templateUrl: './acl-error-view.component.html',
    styleUrls: ['./acl-error-view.component.scss']
})
export class AclErrorViewComponent extends BaseComponent{
    lang = require('./i18n');

    @Input()response: ACLApiResponse;

    public static aclApiResponse: Subject<ACLApiResponse> = new Subject<ACLApiResponse>();

    public rapidError: string;

    constructor(private aclService: MspACLService, private cd: ChangeDetectorRef ,private router: Router) {
        super(cd);
        AclErrorViewComponent.aclApiResponse.subscribe(res => {
            if (res && res.rapidResponse) {
                this.aclService
                    .sendSpaEnvServer(res.rapidResponse)
                    .subscribe(response => {
                        console.log(response);
                        this.rapidError =  response.message;
                    });

            }
        });


       /* AclErrorViewComponent.aclApiResponse.subscribe()(res => {
            this.searchval.patchValue({Search: res})
        });*/



    }
    retrySubmission() {
        this.router.navigate(['/msp/account-letter/personal-info']);
    }

}
