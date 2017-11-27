import {Component, OnInit} from '@angular/core';
import {MspApplication} from "../../model/application.model";
import {MspDataService} from '../../service/msp-data.service';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../../../environments/environment';

@Component({
    templateUrl: './confirmation.component.html'
})
export class AccountConfirmationComponent implements OnInit {
    lang = require('./i18n');
    confirmationNum: string;
    subscription: Subscription;
    showDepMsg: string;
    faqUrl: string;

    constructor(private dataService: MspDataService,
                private route: ActivatedRoute) {
        this.faqUrl = environment.appConstants.faqUrl;
    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.confirmationNum = params['confirmationNum'],
                    this.showDepMsg = params['showDepMsg'];
            }
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    get nextStep5(){
        return this.lang('./en/index.js').faqLabel.replace('{faqUrl}', this.faqUrl);
    }
}