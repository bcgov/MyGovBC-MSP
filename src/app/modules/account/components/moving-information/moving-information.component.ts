import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from 'app/models/relationship.enum';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';

// TO BE removed - differenece need to be added to msp-core moving-info so that it will work with account
@Component({
  selector: 'msp-child-moving-information',
  templateUrl: './moving-information.component.html',
  styleUrls: ['./moving-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class ChildMovingInformationComponent extends Base implements OnInit {

  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();

  // Web links
  links = environment.links;
  countryList = COUNTRY_LIST;
  // Remove BC from province list
  provinceList = PROVINCE_LIST.map( x => {
    if ( x.provinceCode !== BRITISH_COLUMBIA ) {
      return x;
    }
  }).filter( x => x );

  relationship: string = 'you';

  constructor() {
    super();
  }

  ngOnInit() {
    if ( this.isSpouse ) {
      this.relationship = 'spouse';
    } else if (this.isChild) {
      this.relationship = 'child';
    }
  }
  
  get isApplicant() {
    return this.person.relationship === Relationship.Applicant;
  }

  get isSpouse() {
    return this.person.relationship === Relationship.Spouse;
  }

  get isChild() {
    return this.person.relationship === Relationship.ChildUnder19 ||
           this.person.relationship === Relationship.Child19To24;
  }

  get isOveragedChild() {
    return this.person.relationship === Relationship.Child19To24;
  }

  // Moved from another province
  get isCanadianFromProv() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.MovingFromProvince;
  }

  // Moved from another Country
  get isCanadianFromCountry() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.MovingFromCountry;
  }

  // Not new to BC
  get isCanadianNotBC() {
    return this.person.status === StatusInCanada.CitizenAdult &&
           this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP;
  }

  // Moved from another province
  get isResidentFromProv() {
    return this.person.status === StatusInCanada.PermanentResident &&
            this.person.currentActivity === CanadianStatusReason.MovingFromProvince;
  }

  // Moved from another Country
  get isResidentFromCountry() {
    return this.person.status === StatusInCanada.PermanentResident &&
            this.person.currentActivity === CanadianStatusReason.MovingFromCountry;
  }

  // Not new to BC
  get isResidentNotBC() {
    return this.person.status === StatusInCanada.PermanentResident &&
            this.person.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP;
  }

  get isTemporaryResident() {
    return this.person.status === StatusInCanada.TemporaryResident;
  }

  get requestSchoolInfo() {
    return this.isCanadianFromCountry || this.isCanadianFromProv || this.isCanadianNotBC ||
           this.isResidentFromCountry || this.isResidentFromProv || this.isResidentNotBC;
  }

  get requestPermMoveInfo() {
    return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth) || this.isResidentFromProv ||
          this.isResidentFromCountry || this.isResidentNotBC;
  }

  get arrivalDateRequired() {
    return this.isCanadianFromCountry || this.isResidentFromProv || this.isResidentFromCountry ||
           this.isResidentNotBC;
  }

  get requestAdditionalMoveInfo() {
    return this.isCanadianFromProv || this.isCanadianFromCountry ||
          (this.isCanadianNotBC && this.person.livedInBCSinceBirth !== undefined) ||
          this.isResidentFromProv || this.isResidentFromCountry || this.isResidentNotBC;
  }

}
