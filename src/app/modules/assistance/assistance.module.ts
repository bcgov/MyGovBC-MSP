import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistanceRoutingModule } from './assistance-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';
import { AssistancePrepareComponent } from './pages/prepare/prepare.component';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistancePersonalDetailComponent } from './pages/personal-info/personal-details/personal-details.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceRetroYearsComponent } from './pages/retro-years/retro-years.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistanceSendingComponent } from './pages/sending/sending.component';
import { AssistanceConfirmationComponent } from './pages/confirmation/confirmation.component';
import { DeductionCalculatorComponent } from './pages/prepare/deduction-calculator/deduction-calculator.component';
import { MspAssistanceYearComponent } from './pages/prepare/assistance-year/assistance-year.component';
import { EligibilityCardComponent } from './pages/prepare/eligibility-card/eligibility-card.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule } from 'ngx-bootstrap';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistMailingComponent } from './components/assist-mailing/assist-mailing.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { AssistRatesHelperModalComponent } from './components/assist-rates-helper-modal/assist-rates-helper-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AssistanceRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule
  ],
  declarations: [
    AssistContainerComponent,
    AssistancePrepareComponent,
    AssistancePersonalInfoComponent,
    AssistancePersonalDetailComponent,
    AssistanceReviewComponent,
    AssistanceRetroYearsComponent,
    AssistanceAuthorizeSubmitComponent,
    AssistanceSendingComponent,
    AssistanceConfirmationComponent,
    DeductionCalculatorComponent,
    MspAssistanceYearComponent,
    EligibilityCardComponent,
    AssistContactComponent,
    AssistMailingComponent,
    AssistanceHomeComponent,
    AssistRatesHelperModalComponent
  ],
  exports: [AssistMailingComponent]
})
export class AssistanceModule {}
