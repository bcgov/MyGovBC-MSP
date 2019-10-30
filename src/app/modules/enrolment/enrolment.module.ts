import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnrolmentRoutingModule } from './enrolment-routing.module';
import { EnrolContainerComponent } from './components/enrol-container/enrol-container.component';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { EnrolAddressComponent } from './pages/address/address.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { PrepareComponent } from './pages/prepare/prepare.component';
import { ReviewComponent } from './pages/review/review.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { FormsModule } from '@angular/forms';
import { CaptchaModule } from 'moh-common-lib/captcha';
import { RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { GuardEnrolService } from './services/guard-enrol.service';
import { MspApiEnrolmentService } from '../enrolment/services/msp-api-enrolment.service';
import { PersonReviewCardComponent } from './components/person-review-card/person-review-card.component';
import { AddressReviewPartComponent } from './components/address-review-part/address-review-part.component';
import { ContactReviewCardComponent } from './components/contact-review-card/contact-review-card.component';
import { environment } from '../../../environments/environment';
import { fakeBackendProvider } from '../../_developmentHelpers/fake-backend';

const providerList: any = [
  { provide: AbstractPgCheckService, useClass: GuardEnrolService },
  RouteGuardService,
  MspApiEnrolmentService,
];

if ( environment.useMockBackend ) {
  // provider used to create fake backend - development of registration modules
  providerList.push( fakeBackendProvider );
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MspCoreModule,
    EnrolmentRoutingModule,
    CaptchaModule
  ],
  declarations: [
    EnrolContainerComponent,
    EnrolAddressComponent,
    AuthorizeComponent,
    ChildInfoComponent,
    ConfirmationComponent,
    PersonalInfoComponent,
    PrepareComponent,
    ReviewComponent,
    SpouseInfoComponent,
    PersonReviewCardComponent,
    AddressReviewPartComponent,
    ContactReviewCardComponent
  ],
  providers: [
    providerList
  ]
})
export class EnrolmentModule { }
