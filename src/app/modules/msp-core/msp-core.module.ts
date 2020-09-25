import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MspFullNameComponent } from './components/full-name/full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MspImageErrorModalComponent } from './components/image-error-modal/image-error-modal.component';

// TOBE REVIEWED
import { TransmissionErrorView } from '../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { MspConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { MspCancelComponent } from '../../components/msp/common/cancel/cancel.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { RouterModule } from '@angular/router';
import { MspPersonCardComponent } from './components/person-card/person-card.component';
import { CommonDeductionCalculatorComponent } from './components/common-deduction-calculator/common-deduction-calculator.component';
import { MspAddressCardPartComponent } from './components/address-card-part/address-card-part.component';
import { HttpClientModule } from '@angular/common/http';
import { ReviewPartComponent } from './components/review-part/review-part.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { MspContactCardComponent } from './components/contact-card/contact-card.component';

// New components - use common library or generics
import { CanadianStatusComponent } from './components/canadian-status/canadian-status.component';
import { SupportDocumentsComponent } from './components/support-documents/support-documents.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { MovingInformationComponent } from './components/moving-information/moving-information.component';
import { ContactReviewCardComponent } from './components/contact-review-card/contact-review-card.component';
import { AddressReviewPartComponent } from './components/address-review-part/address-review-part.component';

const componentList = [
  MspFullNameComponent,
  MspImageErrorModalComponent,
  CommonDeductionCalculatorComponent,
  MspAddressCardPartComponent,  // TODO: remove
  ReviewPartComponent, // TODO: remove
  ConfirmationComponent,
  MspPersonCardComponent,
  MspConsentModalComponent,
  MspContactCardComponent,

  // New components to replace MspContactCardComponet, MspAddressCardPartComponent
  AddressReviewPartComponent,
  ReviewCardComponent,
  ContactReviewCardComponent,

  // New components
  CanadianStatusComponent,
  SupportDocumentsComponent,
  PersonalInformationComponent,
  MovingInformationComponent

  // Directives

];

// TODO: Review to determine whether these should be replace with moh-common-lib
// components or be moved into msp-core, or moh-common-lib component updated to
// support functionality
const templistCore = [
  // General
  TransmissionErrorView,
  MspCancelComponent
];
@NgModule({
  imports: [
    CommonModule,
    SharedCoreModule,
    FormsModule,
    NgSelectModule,
    TextMaskModule,
    ModalModule,
    AccordionModule,
    RouterModule,
    TypeaheadModule.forRoot(),
    CaptchaModule,
    HttpClientModule
  ],

  declarations: [
    componentList,
    templistCore,
  ],
  exports: [
    componentList,
    SharedCoreModule,
    CaptchaModule,

    // TODO: Be reviewed
    templistCore,
  ]
})
export class MspCoreModule {}
