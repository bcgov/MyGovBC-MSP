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
import { BenefitEligibilityCardComponent } from './pages/prepare/eligibility-card/eligibility-card.component';
import { TaxYearComponent } from './pages/prepare/tax-year/tax-year.component';
import { MspBenefitDataService } from './services/msp-benefit-data.service';
import { ModalModule } from 'ngx-bootstrap';
import { BenefitSpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { BenefitAddressComponent } from './pages/address/address.component'
import { ProcessService , ProcessStep} from '../../services/process.service';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';



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
    BenefitEligibilityCardComponent,
    TaxYearComponent,
    BenefitSpouseInfoComponent,
    BenefitAddressComponent
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
    this.initProcessService();
  }

  private initProcessService() {
    this.processService.init([
        new ProcessStep('/benefit/prepare'),
        new ProcessStep('/benefit/personal-info'),
        new ProcessStep('/benefit/spouse-info'),
        new ProcessStep('/benefit/contact-info'),
        new ProcessStep('/benefit/review'),
        new ProcessStep('/benefit/authorize'),
        new ProcessStep('/benefit/sending')]);
  }

}
