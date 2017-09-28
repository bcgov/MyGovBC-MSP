import {ChangeDetectorRef, Component, Injectable} from '@angular/core';

import DataService from '../../service/msp-data.service';
import {Router} from '@angular/router';
import {BaseComponent} from "../../common/base.component";
import ProcessService,{ProcessUrls} from "../../service/process.service";
import {LocalStorageService} from 'angular-2-local-storage';

@Component({
  templateUrl: './personal-info.component.html'
})
@Injectable()
export class AccountPersonalInfoComponent extends BaseComponent {

  static ProcessStepNum = 1;
  lang = require('./i18n');


  constructor(private dataService: DataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd:ChangeDetectorRef, private localStorageService: LocalStorageService) {

    super(cd);
  }

  ngOnInit(){
      this.initProcessMembers( this._processService.getStepNumber(ProcessUrls.ACCOUNT_PERSONAL_INFO_URL), this._processService);
  }


}