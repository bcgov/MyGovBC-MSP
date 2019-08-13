import { Component, OnInit } from '@angular/core';
import { MspDataService } from '../../../../services/msp-data.service';
//import {ProcessService} from '../../service/process.service';
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
  template: `
    <div class="row">
      <h1 tabindex="0" class="col-11">{{ title }}</h1>
      <button
        class="btn btn-transparent col-1"
        onclick="window.print();return false;"
      >
        Print

        <i class="fa fa-print fa-lg pointer" aria-hidden="true"></i>
      </button>
    </div>
    <common-page-section layout="double">
      <msp-review-card-wrapper
        [title]="applicantTitle"
        [link]="applicantLink"
      >
        <msp-review-part
          label="Years Selected"
          [value]="appYears"
        ></msp-review-part>
        <msp-review-part
          label="Name"
          [value]="applicantInfo.name"
        ></msp-review-part>
        <msp-review-part
          label="Birthdate"
          [value]="applicantInfo.birthDate"
        ></msp-review-part>
        <msp-review-part
          label="Personal Health Number"
          [value]="applicantInfo.phn"
        ></msp-review-part>
        <msp-review-part
          label="Social Insurance Number"
          [value]="applicantInfo.sin"
        ></msp-review-part>
        <msp-review-part
          label="Documents"
          [value]="applicantInfo.appDocuments"
        ></msp-review-part>
      </msp-review-card-wrapper>
      <msp-review-card-wrapper
        [title]="contactTitle"
        [link]="contactLink"
      >
        <h4 class="link-text">Mailing Address</h4>
        <msp-review-part
          label="Street Address"
          [value]="address.addressLine1"
        ></msp-review-part>
        <msp-review-part
          *ngIf="address.addressLine2"
          label="Address Line 2"
          [value]="address.addressLine2"
        ></msp-review-part>
        <msp-review-part
          *ngIf="address.addressLine3"
          label="Address Line 3"
          [value]="address.addressLine3"
        ></msp-review-part>
        <msp-review-part label="City" [value]="address.city"></msp-review-part>
        <msp-review-part
          label="Province"
          [value]="province"
        ></msp-review-part>
        <msp-review-part
          label="Postal Code"
          [value]="address.postal"
        ></msp-review-part>
        <msp-review-part
          label="Country"
          [value]="country"
        ></msp-review-part>
        <h4 class="mt-4 link-text">Contact</h4>
        <msp-review-part label="Phone Number" [value]="phone"></msp-review-part>
      </msp-review-card-wrapper>
      <aside>
        <msp-review-card-wrapper
          [title]="spouseTitle"
          [link]="spouseLink"
          *ngIf="hasSpouse"
        >
          <msp-review-part
            label="Years selected"
            [value]="spouseYears"
          ></msp-review-part>
          <msp-review-part
            label="Documents"
            [value]="spouseInfo.documents"
          ></msp-review-part>
        </msp-review-card-wrapper>
      </aside>
    </common-page-section>

    <hr />
  `,
  styleUrls: ['./review.component.scss']
})
export class AssistanceReviewComponent {
  title = 'Review your application';

  applicantTitle = 'Applicant Information';
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
    this.stateSvc.setPageStatus( this.route.snapshot.routeConfig.path, true );
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
