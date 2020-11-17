import { Component } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
import {
  ApplicantInformation,
  IApplicantInformation
} from '../../models/applicant-information.model';
import { Address, getCountryDescription, getProvinceDescription } from 'moh-common-lib';
import {
  SpouseInformation,
  ISpouseInformation
} from '../../models/spouse-information.model';
import { ActivatedRoute } from '@angular/router';
import { AssistStateService } from '../../services/assist-state.service';
import { ROUTES_ASSIST } from '../../models/assist-route-constants';

export interface IContactInformation {}

@Component({
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class AssistanceReviewComponent {
  title = 'Review your application';

  applicantTitle = 'Account Holder Information';
  contactTitle = 'Contact Information';
  spouseTitle = 'Spouse Information';

  applicantLink = ROUTES_ASSIST.PERSONAL_INFO.fullpath;
  contactLink = ROUTES_ASSIST.CONTACT.fullpath;
  spouseLink = ROUTES_ASSIST.SPOUSE_INFO.fullpath;

  hasSpouse = false;

  applicantInfo: IApplicantInformation;
  spouseInfo: ISpouseInformation;
  address: Address;
  phone: string;

  constructor(
    private dataService: MspDataService,
    private route: ActivatedRoute,
    private stateSvc: AssistStateService
  ) {
    const app = this.dataService.finAssistApp;

    this.address = app.mailingAddress;
    this.applicantInformation();
    this.hasSpouse = app.hasSpouseOrCommonLaw;
    this.hasSpouse ? this.spouseInformation() : (this.hasSpouse = false);
    this.phone = app.phoneNumber;
  }

  ngOnInit() {
    // No input required on this page
    this.stateSvc.setPageValid( this.route.snapshot.routeConfig.path, true );

    // continue button needs to be selected to be complete
    this.stateSvc.setPageIncomplete( this.route.snapshot.routeConfig.path );
  }

  applicantInformation() {
    const appInfo = new ApplicantInformation(this.dataService.finAssistApp);
    this.applicantInfo = appInfo.getData();
  }

  spouseInformation() {
    const spouseInfo = new SpouseInformation(this.dataService.finAssistApp);
    this.spouseInfo = spouseInfo.getData();
    this.hasSpouse = true;
  }

  get appYears() {
    if ( this.applicantInfo.years && this.applicantInfo.years.length ) {
    return this.applicantInfo.years
      .map(itm => itm.toString())
      .reduce((a, b) => `${a}, ${b}`);
    }
  }

  get spouseYears() {
    if ( this.spouseInfo.years && this.spouseInfo.years.length ) {
    return this.spouseInfo.years
      .map(itm => itm.toString())
      .reduce((a, b) => `${a}, ${b}`);
    }
  }

  get country( ) {
    return getCountryDescription( this.address.country );
  }

  get province() {
    return getProvinceDescription( this.address.province );
  }
}
