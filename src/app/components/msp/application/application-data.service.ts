import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
@Injectable()
export default class MspApplicationDataService {
  private application: MspApplication = new MspApplication();
  private finAssistApplication: FinancialAssistApplication;

  constructor(private localStorageService: LocalStorageService){

    let existing = this.localStorageService.get<FinancialAssistApplication>('financial-appl');
    if(!existing){
      this.finAssistApplication = new FinancialAssistApplication();
    }else{
      this.finAssistApplication = existing;
    }
    console.log('init data service, application: ' + JSON.stringify(this.application));
  } 

  getApplication(): MspApplication {
    return this.application;
  }

  get finAssistApp(): FinancialAssistApplication {
    return this.finAssistApplication;
  }

  saveFinAssistApplication():void {
    this.localStorageService.set('financial-appl',this.finAssistApplication);
  }
}