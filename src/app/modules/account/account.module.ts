import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule, AccordionModule } from 'ngx-bootstrap';
import { AccountPrepareComponent } from './pages/prepare/prepare.component';
import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountDependentChangeComponent } from './pages/dependent-change/dependent-change.component';
import { AccountPersonalDetailsComponent } from './pages/personal-info/personal-details/personal-details.component';
import { AccountDocumentsComponent } from './pages/documents/documents.component';
import { AccountReviewComponent } from './pages/review/review.component';
import { AccountSendingComponent } from './pages/sending/sending.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';
import { RemoveDependentComponent } from './pages/remove-dependents/remove-dependents.component';
import { AddNewDependentBeneficiaryComponent } from './pages/add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { MspAccordionComponent } from './components/accordion/accordion.component';
import { AddDependentComponent } from './pages/add-dependents/add-dependents.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule,
    AccordionModule
  ],
  declarations: [
    AccountContainerComponent,
    AccountPrepareComponent,
    AccountPersonalInfoComponent,
    AccountDependentChangeComponent,
    AccountPersonalDetailsComponent,
    AccountDocumentsComponent,
    AccountReviewComponent,
    AccountSendingComponent,
    AccountConfirmationComponent,
    AddDependentComponent,
    RemoveDependentComponent,
    AddNewDependentBeneficiaryComponent,
    MspAccordionComponent,
    
  ]
})
export class AccountModule { }
