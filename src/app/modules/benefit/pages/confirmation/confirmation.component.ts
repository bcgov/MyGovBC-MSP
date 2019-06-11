import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {MspDataService} from '../../../../services/msp-data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'msp-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class BenefitConfirmationComponent {

    lang = require('./i18n');
    confirmationNum: string;
    subscription: Subscription;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.subscription = this.route.queryParams.subscribe(
            params => {
                this.confirmationNum = params['confirmationNum'];
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
