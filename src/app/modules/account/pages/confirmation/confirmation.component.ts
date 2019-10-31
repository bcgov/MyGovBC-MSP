import { Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
import * as moment from 'moment';
import { ApiStatusCodes } from 'moh-common-lib';
import { environment } from 'environments/environment';

@Component({
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class AccountConfirmationComponent implements OnDestroy {

    confirmationNum: string;
    subscription: Subscription;
    noticeOfAssessment: string;
    isCutOff: boolean;
    isCutOffYear: boolean;
    status: ApiStatusCodes = ApiStatusCodes.ERROR;
    links = environment.links;


    constructor(private route: ActivatedRoute, public dataService: MspAccountMaintenanceDataService) {

    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                const statusCode = params['status'];
                if ( statusCode ) {
                  this.status = statusCode;
                }
                this.confirmationNum = params['confirmationNum'];
            }
        );
    }

    ngAfterViewChecked(){
        //this.dataService.removeMspBenefitApp();
    }

    get isSucess() {
        return this.status === ApiStatusCodes.SUCCESS;
    }

    get accountApp(): MspAccountApp {
        return this.dataService.accountApp;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Today's date
     * @returns {string}
     */
    get dateStamp(): string {
        return moment().format('MMMM dd, yyyy');
    }
}
