import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule, AccordionModule } from 'ngx-bootstrap';

import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
//import { AccountDependentChangeComponent } from './pages/dependent-change/dependent-change.component';
import { AccountPersonalDetailsComponent } from '../account/components/personal-details/personal-details.component';

import { AccountReviewComponent } from './pages/review/review.component';
import { AccountSendingComponent } from './pages/sending/sending.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';
//import { RemoveDependentComponent } from './pages/remove-dependents/remove-dependents.component';
//import { AddNewDependentBeneficiaryComponent } from './pages/add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
//import { AddDependentComponent } from './pages/add-dependents/add-dependents.component';
import { HomeComponent } from './pages/home/home.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { MspAccountMaintenanceDataService } from './services/msp-account-data.service';
import { MspApiAccountService } from './services/msp-api-account.service';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { UpdateRequestComponent } from '../account/components/update-request/update-request.component';
import { AccountFileUploaderComponent } from './pages/personal-info/account-file-uploader/account-file-uploader.component';
import { AddSpouseComponent } from './pages/spouse-info/add-spouse/add-spouse.component';
import { UpdateSpouseComponent } from './pages/spouse-info/update-spouse/update-spouse.component';
import { RemoveSpouseComponent } from './pages/spouse-info/remove-spouse/remove-spouse.component';
import { AddChildComponent } from './pages/child-info/add-child/add-child.component';
import { UpdateChildComponent } from './pages/child-info/update-child/update-child.component';
import { RemoveChildComponent } from './pages/child-info/remove-child/remove-child.component';
import { ChildMovingInformationComponent } from '../account/components/moving-information/moving-information.component';

@NgModule({
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule
  ],
  declarations: [
    AccountContainerComponent,
    AccountPersonalInfoComponent,
    AccountPersonalDetailsComponent,
    AccountReviewComponent,
    AccountSendingComponent,
    AccountConfirmationComponent,
    HomeComponent,
    SpouseInfoComponent,
    ChildInfoComponent,
    AuthorizeComponent,
    ContactInfoComponent,
    UpdateRequestComponent,
    AccountFileUploaderComponent,
    AddSpouseComponent,
    UpdateSpouseComponent,
    RemoveSpouseComponent,
    AddChildComponent,
    UpdateChildComponent,
    RemoveChildComponent,
    ChildMovingInformationComponent
  ],
  providers: [
    { provide: AbstractPgCheckService, useExisting: CheckCompleteBaseService },
    RouteGuardService,
    MspAccountMaintenanceDataService,
    MspApiAccountService
  ]
})
export class AccountModule { }
