import { Injectable } from '@angular/core';
import {MspApplication, Applicant, Person} from './application';

@Injectable()
export default class MspApplicationDataService {
  private application: MspApplication = new MspApplication();

  constructor(){

    console.log('init data service, application: ' + JSON.stringify(this.application));
  } 

  getApplication(): MspApplication{
    return this.application;
  }
}