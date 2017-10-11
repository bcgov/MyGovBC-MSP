import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { MspDataService } from '../../service/msp-data.service';
import { Router } from '@angular/router';
import { BaseComponent } from "../../common/base.component";
import { ProcessService } from "../../service/process.service";
import { LocalStorageService } from 'angular-2-local-storage';

import {  Person } from '../../model/application.model';

@Component({
  templateUrl: './dependent-change.component.html',
  styleUrls: ['./dependent-change.component.scss']
})
@Injectable()
export class AccountDependentChangeComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');


  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

  ngOnInit() {
    // this.initProcessMembers(AccountDependentChangeComponent.ProcessStepNum, this._processService);
  }

  get person(): Person {
    return this.dataService.getMspApplication().applicant;
  }

  onChange($event){
    console.log('dependent-change onChange()', $event);
  }

  canContinue(): boolean {
    return true;
  }

  addSpouse(){
    console.log('addSpouse called!');
  }


}