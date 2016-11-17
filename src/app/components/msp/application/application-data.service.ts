import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';

@Injectable()
export default class MspApplicationDataService {
  private application: MspApplication = new MspApplication();
  private finAssistApplication: FinancialAssistApplication = new FinancialAssistApplication();

  constructor(){

    console.log('init data service, application: ' + JSON.stringify(this.application));
  } 

  getApplication(): MspApplication {
    return this.application;
  }

  get finAssistApp(): FinancialAssistApplication {
    return this.finAssistApplication;
  }
}