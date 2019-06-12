import {ChangeDetectorRef, Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MspDataService } from '../../../../services/msp-data.service';
import { Router } from '@angular/router';
import {AssistancePersonalDetailComponent} from './personal-details/personal-details.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BaseComponent } from '../../../../models/base.component';
import { MspAddressComponent } from '../../../msp-core/components/address/address.component';
import { MspPhoneComponent } from '../../../../components/msp/common/phone/phone.component';
import { FinancialAssistApplication } from '../../models/financial-assist-application.model';

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
    //private _processService: ProcessService,
    cd: ChangeDetectorRef) {
    super(cd);
    this.financialAssistApplication = this.dataService.finAssistApp;
    // if the country is blank or null or undefined then assign Canada By Default //DEF-153
    if (!this.financialAssistApplication.mailingAddress.country || this.financialAssistApplication.mailingAddress.country.trim().length === 0 ) {
        this.financialAssistApplication.mailingAddress.country = 'Canada';
    }
  }

  ngAfterViewInit() {

    this.personalInfoForm.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe( () => {
      this.dataService.saveFinAssistApplication();
    });
  }

  ngOnInit(){
  //  this.initProcessMembers(AssistancePersonalInfoComponent.ProcessStepNum, this._processService);
  }

  onChange($event) {
    // console.log('changes from child component triggering save: ', values);
    this.dataService.saveFinAssistApplication();
  }

  onSubmit($event){
   this._router.navigate(['/assistance/retro']);
  }

  isValid(): boolean {
    return this.dataService.finAssistApp.isUniquePhns && this.dataService.finAssistApp.isUniqueSin;
  }

  get canContinue(): boolean{
    return this.isAllValid() && this.hasCountry();
  }

  // Final check to see if the country is present // DEF 153
  hasCountry(): boolean {
    if (this.financialAssistApplication.mailingAddress.country && this.financialAssistApplication.mailingAddress.country.trim().length > 0) {
      return true;
    } else {
      return false;
    }

  }

}
