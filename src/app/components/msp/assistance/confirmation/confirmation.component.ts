import {Component} from '@angular/core';
import DataService from '../../service/msp-data.service';
import {FinancialAssistApplication} from "../../model/financial-assist-application.model";
require('./confirmation.component.less');
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './confirmation.component.html'
})
export class AssistanceConfirmationComponent {
  lang = require('./i18n');
  confirmationNum:string;
  subscription: Subscription;

  constructor(private dataService: DataService,
              private route: ActivatedRoute) {
  }

  ngOnInit():void {
    this.subscription = this.route.queryParams.subscribe(
      params => {
        this.confirmationNum = params['confirmationNum'] || 'N/A';
      }
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }  
}