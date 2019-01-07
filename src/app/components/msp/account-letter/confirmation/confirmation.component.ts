import {Component, OnInit} from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Subscription} from 'rxjs';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class AccountLetterConfirmationComponent implements OnInit{
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

}
