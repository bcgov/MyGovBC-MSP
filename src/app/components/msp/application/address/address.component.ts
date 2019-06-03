import {ChangeDetectorRef, Input, Component, ViewChild, ElementRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import { MspDataService } from '../../service/msp-data.service';
import {MspApplication} from '../../model/application.model';
//import {Address} from '../../model/address.model';
import {BaseComponent} from '../../common/base.component';
import {MspAddressComponent} from '../../common/address/address.component';
import {MspPhoneComponent} from '../../common/phone/phone.component';
import {ProcessService} from '../../service/process.service';
import {Router} from '@angular/router';
import {Address,Person} from 'moh-common-lib/models';
import {
  CountryList,
  ProvinceList,
  CANADA,
  BRITISH_COLUMBIA
} from 'moh-common-lib';

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent extends BaseComponent {

  static ProcessStepNum = 4;

  lang = require('./i18n');

  @ViewChild('formRef') form: NgForm;
  @ViewChild('address') address: ElementRef;
  @ViewChild('mailingAddress') mailingAddress: ElementRef;
  @ViewChild('phone') phone: ElementRef;
  @Input() editIdentityInfo: boolean = true;
  @Input() countryList: CountryList[] = this.lang('./en/index.js').countryData;
  @Input() provinceList: ProvinceList[] = this.lang('./en/index.js').provinceData;

  
  public defaultCountry = CANADA;
  public defaultProvince = BRITISH_COLUMBIA;


  mspApplication: MspApplication;

  constructor(private dataService: MspDataService,
              private _router: Router,
              private _processService: ProcessService,
              private cd: ChangeDetectorRef) {
    super(cd);
    this.mspApplication = this.dataService.getMspApplication();
    this.mspApplication.mailingSameAsResidentialAddress = true;
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
    console.log('Abhi phone num--'+evt);
    this.mspApplication.phoneNumber = evt;
    this.dataService.saveMspApplication();
  }

  toggleMailingSameAsResidentialAddress(evt: boolean){
    this.mspApplication.mailingSameAsResidentialAddress = !evt;
    if (evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveMspApplication();
  }

  toggleCheckBox(){
    this.mspApplication.mailingSameAsResidentialAddress = !this.mspApplication.mailingSameAsResidentialAddress;
    this.dataService.saveMspApplication();
  }

  handleAddressUpdate(evt: any){
    console.log(evt);
    console.log('address update event: %o', evt);
    evt.addressLine1 = evt.street;
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
     // this._processService.setStep(4, true);
      this._router.navigate(['/msp/application/review']);
    }
  }
}
