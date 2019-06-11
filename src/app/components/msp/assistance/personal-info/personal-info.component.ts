import {ChangeDetectorRef, Component, ViewChild, AfterViewInit, OnInit, ViewChildren, QueryList} from '@angular/core';
import { FormGroup, NgForm, AbstractControl } from '@angular/forms';

import { MspDataService } from '../../../../services/msp-data.service';
import { CompletenessCheckService}  from '../../../../services/completeness-check.service';
import {FinancialAssistApplication} from '../../model/financial-assist-application.model';
import { Router } from '@angular/router';
import {BaseComponent} from '../../common/base.component';
import {AssistancePersonalDetailComponent} from './personal-details/personal-details.component';
import {MspAddressComponent} from '../../common/address/address.component';
import {MspPhoneComponent} from '../../common/phone/phone.component';
import {ProcessService} from '../../service/process.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  templateUrl: './personal-info.component.html'
})
export class AssistancePersonalInfoComponent extends BaseComponent{
  //DEF-74 KPS
  static ProcessStepNum = 1;

  lang = require('./i18n');

  @ViewChild('formRef') personalInfoForm: NgForm;
  @ViewChildren(AssistancePersonalDetailComponent) personalDetailsComponent: QueryList<AssistancePersonalDetailComponent>;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;
  financialAssistApplication: FinancialAssistApplication;

  constructor(private dataService: MspDataService,
    private _router: Router,
    private _processService: ProcessService,
    private cd: ChangeDetectorRef) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if(!this.financialAssistApplication.mailingAddress.country || this.financialAssistApplication.mailingAddress.country.trim().length === 0 ) {
        this.financialAssistApplication.mailingAddress.country = 'Canada';
    } 
  }

  ngAfterViewInit() {

    this.personalInfoForm.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe( values => {
      this.dataService.saveFinAssistApplication();
    });
  }

  ngOnInit(){
    this.initProcessMembers(AssistancePersonalInfoComponent.ProcessStepNum, this._processService);
  }

  onChange(values: any) {
    // console.log('changes from child component triggering save: ', values);
    this.dataService.saveFinAssistApplication();
  }

  onSubmit(form: NgForm){
   this._router.navigate(['/msp/assistance/retro']);
  }

  isValid(): boolean {
    return this.dataService.finAssistApp.isUniquePhns && this.dataService.finAssistApp.isUniqueSin;
  }

  get canContinue(): boolean{
    return this.isAllValid() && this.hasCountry();
  }

  // Final check to see if the country is present // DEF 153
  hasCountry(): boolean {
    if(this.financialAssistApplication.mailingAddress.country && this.financialAssistApplication.mailingAddress.country.trim().length > 0) {
      return true;
    } else { 
      return false;
    }
 
  }

}
