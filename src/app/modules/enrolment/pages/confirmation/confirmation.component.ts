import {Component, OnInit} from '@angular/core';
import {MspApplication} from '../../models/application.model';
import { MspDataService } from '../../../../services/msp-data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable,  Subscription} from 'rxjs';
import * as moment from 'moment';

@Component({
  templateUrl: './confirmation.component.html'
})
export class ConfirmationComponent implements OnInit{
  lang = require('./i18n');
  confirmationNum: string;
  subscription: Subscription;
  constructor(private dataService: MspDataService,
              private route: ActivatedRoute) {
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

  /**
   * Today's date
   * @returns {string}
   */
  get dateStamp(): string {
    return moment().format('MMMM DD, YYYY');
  }

}
