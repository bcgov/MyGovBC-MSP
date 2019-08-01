import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenefitRoutingModule } from './benefit-routing.module';
import { BenefitContainerComponent } from './components/benefit-container/benefit-container.component';
import { FormsModule } from '@angular/forms';
import { BenefitPrepareComponent } from './pages/financial-info/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { BenefitEligibilityCardComponent } from './pages/financial-info/eligibility-card/eligibility-card.component';
import { TaxYearComponent } from './pages/financial-info/tax-year/tax-year.component';
import { MspBenefitDataService } from './services/msp-benefit-data.service';
import { ModalModule } from 'ngx-bootstrap';
import { BenefitSpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { BenefitAddressComponent } from './pages/contact-info/address.component';
import { ProcessService , ProcessStep} from '../../services/process.service';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { PersonalDetailsRetroSuppbenComponent } from '../msp-core/components/personal-details-retro-suppben/personal-details-retro-suppben.component';
import { EligibilityComponent } from './pages/eligibility/eligibility.component';



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
    BenefitReviewComponent,
    BenefitAuthorizeSubmitComponent,
    BenefitSendingComponent,
    BenefitConfirmationComponent,
    BenefitEligibilityCardComponent,
    TaxYearComponent,
    BenefitSpouseInfoComponent,
    BenefitAddressComponent,
    EligibilityComponent
  ],
  providers: [
    { provide: AbstractPgCheckService, useExisting: CheckCompleteBaseService },
    RouteGuardService,
    MspBenefitDataService,
    ProcessService
  ]
})
export class BenefitModule {

  constructor(private processService: ProcessService) {
    console.log('1');
    this.initProcessService();
  }

  private initProcessService() {
    this.processService.init([
        new ProcessStep('/benefit/financial-info'),
        new ProcessStep('/benefit/personal-info'),
        new ProcessStep('/benefit/spouse-info'),
        new ProcessStep('/benefit/contact-info'),
        new ProcessStep('/benefit/review'),
        new ProcessStep('/benefit/authorize'),
        new ProcessStep('/benefit/sending')]);
  }

}
