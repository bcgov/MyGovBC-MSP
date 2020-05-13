import { Component, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import { MspAccountMaintenanceDataService } from '../../services/msp-account-data.service';
import {ActivatedRoute} from '@angular/router';
import { MspAccountApp } from '../../models/account.model';
import * as moment from 'moment';
import { ApiStatusCodes } from 'moh-common-lib';
import { environment } from 'environments/environment';
import { format } from 'date-fns';

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
    nextSteps: any;
    message: string;
    hasSpouseAdded: boolean;
    hasSpouseRemoved: boolean;
    hasPrevMSPForSpouse: boolean;
    hasChildAdded: boolean;
    hasChildRemoved: boolean;
    hasPrevMSPForChild: boolean;

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
                this.nextSteps = params['nextSteps'];
                this.message = params['message'];
                this.hasSpouseAdded = params['hasSpouseAdded'];
                this.hasSpouseRemoved = params['hasSpouseRemoved'];
                this.hasPrevMSPForSpouse = params['hasPrevMSPForSpouse'];
                this.hasChildAdded = params['hasChildAdded'];
                this.hasChildRemoved = params['hasChildRemoved'];
                this.hasPrevMSPForChild = params['hasPrevMSPForChild'];
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

    get hasRemovedSpouseOrChild() {
        return this.hasSpouseRemoved || this.hasChildRemoved;
    }

    get hasAddedSpouseOrChildWithNoPrevMSP() {
        if (this.hasSpouseAdded || this.hasChildAdded){
            if (!this.hasPrevMSPForSpouse || !this.hasPrevMSPForChild){
                return true;
            }
        }
        return false;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Today's date
     * @returns {string}
     */
    get dateStamp(): string {
        return format(new Date(), 'MMMM dd, yyyy');
    }
}
