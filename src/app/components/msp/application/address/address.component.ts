import {Component, Input, ViewChild, Output, EventEmitter, AfterViewInit, OnInit} from '@angular/core'
import {NgForm} from "@angular/forms";
import DataService from '../../service/msp-data.service';
import CompletenessCheckService from '../../service/completeness-check.service';
import {MspApplication} from "../../model/application.model";
import {Person} from "../../model/person.model";
import {Address} from "../../model/address.model";
import {UUID} from "angular2-uuid";

@Component({
  templateUrl: './address.component.html'
})
export class AddressComponent implements AfterViewInit{
  lang = require('./i18n');
  @ViewChild('formRef') form: NgForm;
  
  mspApplication: MspApplication;
  outOfProvinceFor30DayCandidates: Person[];
  departurePersonUuids: string[];

  constructor(private dataService: DataService, 
    private completenessService: CompletenessCheckService) {
    this.mspApplication = this.dataService.getMspApplication();
    this.outOfProvinceFor30DayCandidates = this.mspApplication.getOutOfProvinceFor30DayCandidates();

    this.departurePersonUuids = new Array<string>();
    for (let person of this.mspApplication.getOutOfProvincePersons()) {
      this.departurePersonUuids.push(person.uuid);
    }
  }

  ngAfterViewInit():void {
    this.form.valueChanges.subscribe(values => {
      this.dataService.saveMspApplication();
    });
  }

  handlePhoneNumberChange(evt:any) {
    this.mspApplication.phoneNumber = evt;    
    this.dataService.saveMspApplication();
  }

  toggleMailingSameAsResidentialAddress(evt:boolean){
    this.mspApplication.mailingSameAsResidentialAddress = evt;
    if(evt){
      this.mspApplication.mailingAddress = new Address();
    }
    this.dataService.saveMspApplication();
  }

  handleAddressUpdate(evt:any){
    // console.log('address update event: %o', evt);
    this.dataService.saveMspApplication();
  }

  canContinue(){
    return this.completenessService.mspContactInfoCompleted();
  }
}