import { Injectable } from '@angular/core';
import DataService from './msp-data.service';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';

import * as _ from 'lodash';

@Injectable()
export default class CompletenessCheckService {
    private finApp:FinancialAssistApplication;
    constructor(private dataService: DataService) {
        this.finApp = this.dataService.finAssistApp;
    }

    private isNumber(arg:any){
      return(!!arg && arg.length > 0 && !Number.isNaN(arg))
    }

    finAppPrepCompleted():boolean{
        let basics:boolean = this.isNumber(this.finApp.netIncomelastYear) && 
        this.finApp.netIncomelastYear >= 0 &&
        _.isBoolean(this.finApp.ageOver65) &&
        _.isBoolean(this.finApp.hasSpouseOrCommonLaw);
        
        let spouseInfo:boolean = true;
        if(basics){
            if(this.finApp.spouseEligibleForDisabilityCredit){
              spouseInfo = this.finApp.hasSpouseOrCommonLaw;
            }
            if(spouseInfo){
              if(this.finApp.hasSpouseOrCommonLaw){
                  spouseInfo = this.isNumber(this.finApp.spouseIncomeLine236) &&
                  this.finApp.spouseIncomeLine236 >= 0;
              }
            }
        }
        return basics && spouseInfo;
    }

    finAppPersonalInfoCompleted():boolean {
      return true;
    }

    finAppReviewCompleted():boolean {
      return true;
    }

    finAppAuthorizationCompleted():boolean {
      return true;
    }
}