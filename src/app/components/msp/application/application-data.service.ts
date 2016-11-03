import { Injectable } from '@angular/core';
import {MspApplicantioin, Applicant, Person} from './application';

@Injectable()
export default class MspApplicationDataService {
  private application: MspApplicantioin = new MspApplicantioin();

  constructor(){

    console.log('init data service, application: ' + JSON.stringify(this.application));
  } 

  getApplication(): MspApplicantioin{
    return this.application;
  }
}