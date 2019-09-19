import { Component, OnInit, forwardRef, EventEmitter, Input, Output } from '@angular/core';
import { Base, Person, PROVINCE_LIST, BRITISH_COLUMBIA, COUNTRY_LIST } from 'moh-common-lib';
import { ControlContainer, NgForm } from '@angular/forms';
import { MspPerson } from '../../../account/models/account.model';
import { StatusInCanada, CanadianStatusReason } from '../../../msp-core/models/canadian-status.enum';
import { environment } from '../../../../../environments/environment';
import { Relationship } from '../../../msp-core/models/relationship.enum';

@Component({
  selector: 'msp-moving-information',
  templateUrl: './moving-information.component.html',
  styleUrls: ['./moving-information.component.scss'],

  /* Re-use the same ngForm that it's parent is using. The component will show
   * up in its parents `this.form`, and will auto-update `this.form.valid`
   */
  viewProviders: [
    { provide: ControlContainer, useExisting: forwardRef(() => NgForm) }
  ]
})
export class MovingInformationComponent extends Base implements OnInit {

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
    if ( this.person.relationship !== Relationship.Applicant ) {
      this.relationship = 'they';
    }
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


}
