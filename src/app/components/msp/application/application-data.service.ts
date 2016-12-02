import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
@Injectable()
export default class MspApplicationDataService {
  private application: MspApplication;
  private finAssistApplication: FinancialAssistApplication;

  constructor(private localStorageService: LocalStorageService){

    let existingFinApp = this.localStorageService.get<FinancialAssistApplication>('financial-appl');
    if(!existingFinApp){
      this.finAssistApplication = new FinancialAssistApplication();
    }else{
      this.finAssistApplication = new FinancialAssistApplication();
      // this.finAssistApplication = existingFinApp;
    }

    let existingMainApp = this.localStorageService.get<MspApplication>('msp-appl');
    if(!existingMainApp){
      this.application = new MspApplication();
    }else{
      this.application = new MspApplication();
      // turn on the following in when the entire application model class is wired up with screens.
      // this.application = existingMainApp;
    }

    console.log('init data service, fin assistance application: ' + JSON.stringify(this.finAssistApplication));
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

  saveMspApplication():void {
    this.localStorageService.set('msp-appl',this.application);
  }
}