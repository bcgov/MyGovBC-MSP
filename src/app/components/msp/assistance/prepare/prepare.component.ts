import { Component } from '@angular/core';
import DataService from '../../application/application-data.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';

require('./prepare.component.less');

@Component({
  templateUrl: './prepare.component.html'
})
export class AssistancePrepareComponent {
  lang = require('./i18n');
  _showDisabilityInfo:boolean = false;
  private _showChildrenInfo:boolean = false;
  constructor(private dataService: DataService){

  }

  get showDisabilityInfo(){
    return this._showDisabilityInfo;
  }

  set showDisabilityInfo(doShow:boolean){
    this._showDisabilityInfo = doShow;
  }

  get showChildrenInfo() {
    return this._showChildrenInfo;
  }

  set showChildrenInfo(show: boolean){
    this._showChildrenInfo = show;
  }

  get finAssistApp(): FinancialAssistApplication{
    return this.dataService.finAssistApp;
  }

  addSpouse():void {
    this.finAssistApp.hasSpouseOrCommonLaw = true;
  }
}
