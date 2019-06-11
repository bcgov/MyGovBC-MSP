import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitRoutingModule } from './benefit-routing.module';
import { BenefitContainerComponent } from './components/benefit-container/benefit-container.component';
import { FormsModule } from '@angular/forms';
import { BenefitPrepareComponent } from './pages/prepare/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { BenefitDocumentsComponent } from './pages/documents/documents.component';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';
import { BenefitPersonalDetailComponent } from './pages/personal-info/personal-detail/personal-detail.component';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { BenefitDeductionCalculatorComponent } from './pages/prepare/benefit-deduction-calculator/benefit-deduction-calculator.component';
import { BenefitEligibilityCardComponent } from './pages/prepare/eligibility-card/eligibility-card.component';
import { TaxYearComponent } from './pages/prepare/tax-year/tax-year.component';
import { MspBenefitDataService } from '../../components/msp/service/msp-benefit-data.service';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BenefitRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule
  ],
  declarations: [
    BenefitContainerComponent,
    BenefitPrepareComponent,
    BenefitPersonalInfoComponent,
    BenefitPersonalDetailComponent,
    BenefitDocumentsComponent,
    BenefitReviewComponent,
    BenefitAuthorizeSubmitComponent,
    BenefitSendingComponent,
    BenefitConfirmationComponent,
    BenefitDeductionCalculatorComponent,
    BenefitEligibilityCardComponent,
    TaxYearComponent
  ],
  providers: [
    MspBenefitDataService
  ]
})
export class BenefitModule { }
