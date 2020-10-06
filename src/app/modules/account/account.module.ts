import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountPersonalDetailsComponent } from '../account/components/personal-details/personal-details.component';

import { AccountReviewComponent } from './pages/review/review.component';
import { AccountSendingComponent } from './pages/sending/sending.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';
import { HomeComponent } from './pages/home/home.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { MspAccountMaintenanceDataService } from './services/msp-account-data.service';
import { MspApiAccountService } from './services/msp-api-account.service';
import { Container, CheckCompleteBaseService, RouteGuardService, AbstractPgCheckService, BYPASS_GUARDS, DefaultPageGuardService, AbstractPageGuardService, LoadPageGuardService, START_PAGE_URL } from 'moh-common-lib';
import { UpdateRequestComponent } from '../account/components/update-request/update-request.component';
import { AddSpouseComponent } from './pages/spouse-info/add-spouse/add-spouse.component';
import { UpdateSpouseComponent } from './pages/spouse-info/update-spouse/update-spouse.component';
import { RemoveSpouseComponent } from './pages/spouse-info/remove-spouse/remove-spouse.component';
import { AddChildComponent } from './pages/child-info/add-child/add-child.component';
import { UpdateChildComponent } from './pages/child-info/update-child/update-child.component';
import { RemoveChildComponent } from './pages/child-info/remove-child/remove-child.component';
import { ChildMovingInformationComponent } from '../account/components/moving-information/moving-information.component';
import { environment } from 'environments/environment';
import { AccountPersonCardComponent } from './components/person-card/person-card.component';
import { AccountPersonalInformationComponent } from './components/personal-information/personal-information.component';
import { ProcessService , ProcessStep} from '../../services/process.service';
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
    AccountPersonalInformationComponent,
    AccountPersonalDetailsComponent,
    AccountPersonCardComponent,
    AccountReviewComponent,
    AccountSendingComponent,
    AccountConfirmationComponent,
    HomeComponent,
    SpouseInfoComponent,
    ChildInfoComponent,
    AuthorizeComponent,
    ContactInfoComponent,
    UpdateRequestComponent,
    AddSpouseComponent,
    UpdateSpouseComponent,
    RemoveSpouseComponent,
    AddChildComponent,
    UpdateChildComponent,
    RemoveChildComponent,
    ChildMovingInformationComponent
  ],

  providers: [
    {
      provide: BYPASS_GUARDS,
      useValue:
        environment.bypassGuards,
    },
    { provide: START_PAGE_URL, useValue: 'deam/personal-info' },
    DefaultPageGuardService,
    { provide: AbstractPageGuardService, useExisting: DefaultPageGuardService },
    LoadPageGuardService,
    MspAccountMaintenanceDataService,
    MspApiAccountService
  ]
})

export class AccountModule {
  // DEAM interim - any links to account pages should redirect to /deam-interim
  //constructor(){
    // window.location.href = window.location.origin + '/msp/deam-interim/';
  //}
  constructor(private processService: ProcessService) {
    this.initProcessService();
  }

  private initProcessService() {
    this.processService.init([
        new ProcessStep('/deam/personal-info'),
        new ProcessStep('/deam/spouse-info'),
        new ProcessStep('/deam/child-info'),
        new ProcessStep('/deam/contact-info'),
        new ProcessStep('/deam/review'),
        new ProcessStep('/deam/authorize'),
        new ProcessStep('/deam/sending')]);
  }
}
