import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestAclRoutingModule } from './request-acl-routing.module';
import { RequestLetterComponent } from './pages/request-letter/request-letter.component';
import { AclConfirmationComponent } from './pages/acl-confirmation/acl-confirmation.component';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { MspCoreModule } from '../msp-core/msp-core.module';
import { AclDataService } from './services/acl-data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedCoreModule,
    MspCoreModule,
    RequestAclRoutingModule
  ],
  declarations: [
    RequestLetterComponent,
    AclConfirmationComponent
  ],
  providers: [
    AclDataService
  ]
})
export class RequestAclModule { }
