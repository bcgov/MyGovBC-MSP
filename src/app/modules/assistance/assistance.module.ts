import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistanceRoutingModule } from './assistance-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistanceSendingComponent } from './pages/sending/sending.component';
import { AssistanceConfirmationComponent } from './pages/confirmation/confirmation.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistMailingComponent } from './components/assist-mailing/assist-mailing.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { AssistRatesHelperModalComponent } from './components/assist-rates-helper-modal/assist-rates-helper-modal.component';
import { AssistCraDocumentsComponent } from './components/assist-cra-documents/assist-cra-documents.component';
import { SpouseComponent } from './pages/spouse/spouse.component';
import { RouteGuardService , AbstractPgCheckService } from 'moh-common-lib';
import { AssistGuard } from './guards/assist.guard';
import { AssistRatesModalComponent } from './components/assist-rates-modal/assist-rates-modal.component';

@NgModule({
  imports: [
    CommonModule,
    AssistanceRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AssistContainerComponent,
    AssistancePersonalInfoComponent,
    AssistanceReviewComponent,
    AssistanceAuthorizeSubmitComponent,
    AssistanceSendingComponent,
    AssistanceConfirmationComponent,
    AssistContactComponent,
    AssistMailingComponent,
    AssistanceHomeComponent,
    AssistRatesHelperModalComponent,
    AssistCraDocumentsComponent,
    SpouseComponent,
    AssistRatesModalComponent
  ],
  providers: [
    { provide: AbstractPgCheckService, useClass: AssistGuard },
    RouteGuardService,
    BsModalService
  ],
  exports: [AssistMailingComponent]
})
export class AssistanceModule {}
