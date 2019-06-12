import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountLetterRoutingModule } from './account-letter-routing.module';
import { AccletContainerComponent } from './components/acclet-container/acclet-container.component';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { ModalModule } from 'ngx-bootstrap';
import { AccountLetterComponent } from './pages/account-letter.component';
import { AccountLetterPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountLetterSendingComponent } from './pages/sending/sending.component';
import { AccountLetterConfirmationComponent } from './pages/confirmation/confirmation.component';
import { SpecificMemberComponent } from './pages/personal-info/specific-member/specific-member.component';
import { AclErrorViewComponent } from './pages/sending/acl-error-view/acl-error-view.component';

@NgModule({
  imports: [
    CommonModule,
    AccountLetterRoutingModule,
    FormsModule,
    MspCoreModule,
    ModalModule,
  ],
  declarations: [
    AccletContainerComponent,
    AccountLetterComponent,
    AccountLetterPersonalInfoComponent,
    AccountLetterSendingComponent,
    AccountLetterConfirmationComponent,
    SpecificMemberComponent,
    AclErrorViewComponent
  ]
})
export class AccountLetterModule { }
