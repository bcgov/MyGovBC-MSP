import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import {MspApplication} from '../../model/application.model';
import {Address} from '../../model/address.model';
import {BaseComponent} from '../../common/base.component';
import {MspAddressComponent} from '../../common/address/address.component';
import {MspPhoneComponent} from '../../common/phone/phone.component';
import {ProcessService} from '../../service/process.service';
import {Router} from '@angular/router';

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent extends BaseComponent {

  static ProcessStepNum = 2;

  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: MspAddressComponent;
  @ViewChild('phone') phone: MspPhoneComponent;

  mspApplication: MspApplication;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.getMspApplication();
  }
  ngOnInit(){
    this.initProcessMembers(AddressComponent.ProcessStepNum, this._processService);
  }

  ngAfterViewInit(): void {
    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  handlePhoneNumberChange(evt: any) {
    this.mspApplication.phoneNumber = evt;
    this.dataService.saveMspApplication();
  }

  toggleMailingSameAsResidentialAddress(evt: boolean){
    this.mspApplication.mailingSameAsResidentialAddress = evt;
    if (evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveMspApplication();
  }

  handleAddressUpdate(evt: any){
    // console.log('address update event: %o', evt);
    this.dataService.saveMspApplication();
  }

  canContinue(){
    return this.isAllValid();
  }

  continue() {
    // console.log('personal info form itself valid: %s', this.form.valid);
    console.log('combinedValidationState on address: %s', this.isAllValid());
    if (!this.isAllValid()){
      console.log('Please fill in all required fields on the form.');
    }else{
      this._router.navigate(['/msp/application/review']);
    }
  }
}
