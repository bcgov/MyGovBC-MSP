import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MspFullNameComponent } from './components/full-name/full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { FormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { MspBirthDateComponent } from './components/birthdate/birthdate.component';
import { MspImageErrorModalComponent } from './components/image-error-modal/image-error-modal.component';

// TOBE REVIEWED
import { TransmissionErrorView } from '../../components/msp/common/transmission-error-view/transmission-error-view.component';
import { MspConsentModalComponent } from './components/consent-modal/consent-modal.component';
import { MspCancelComponent } from '../../components/msp/common/cancel/cancel.component';
import { MspToggleComponent } from '../../components/msp/common/toggle/toggle.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule, AccordionModule, TypeaheadModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { MspPersonCardComponent } from './components/person-card/person-card.component';
import { MspContactCardComponent } from './components/contact-card/contact-card.component';
import { CommonDeductionCalculatorComponent } from './components/common-deduction-calculator/common-deduction-calculator.component';
import { MspAddressCardPartComponent } from './components/address-card-part/address-card-part.component';
import { HttpClientModule } from '@angular/common/http';
import { ReviewPartComponent } from './components/review-part/review-part.component';
import { ReviewCardWrapperComponent } from './components/review-card-wrapper/review-card-wrapper.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { PersonalDetailsRetroSuppbenComponent } from './components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import { AddressRetroSuppbenComponent } from './components/address-retro-suppben/address-retro-suppben.component';
import { CoreContactInfoComponent } from './components/core-contact-info/core-contact-info.component';


// New components - use common library
import { CanadianStatusComponent } from './components/canadian-status/canadian-status.component';
import { SupportDocumentsComponent } from './components/support-documents/support-documents.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';

const componentList = [
  MspFullNameComponent,
  MspBirthDateComponent,
  MspImageErrorModalComponent,
  CommonDeductionCalculatorComponent,
  MspAddressCardPartComponent,
  ReviewPartComponent,
  PersonalDetailsRetroSuppbenComponent,
  ConfirmationComponent,
  CoreContactInfoComponent,
  MspPersonCardComponent,

  // New components
  CanadianStatusComponent,
  SupportDocumentsComponent,
  PersonalInformationComponent,

  // Directives
  ReviewCardWrapperComponent,
];

// TODO: Review to determine whether these should be replace with moh-common-lib
// components or be moved into msp-core, or moh-common-lib component updated to
// support functionality
const templistCore = [
  // General
  TransmissionErrorView,
  MspConsentModalComponent,
  MspCancelComponent,
  MspToggleComponent,
  MspContactCardComponent,
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
    AddressRetroSuppbenComponent,
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
