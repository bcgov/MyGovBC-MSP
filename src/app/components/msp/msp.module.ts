import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, ModalModule } from 'ngx-bootstrap';
//import { MspAddressCardPartComponent } from './common/address-card-part/address-card-part.component';
import { TextMaskModule } from 'angular2-text-mask';
import { MspLoggerDirective } from './common/logging/msp-logger.directive';
import { MspACLService } from './service/msp-acl-api.service';
import { MspLog2Service } from './service/log2.service';
import { MspValidationService } from '../../services/msp-validation.service';
import { ProcessService } from '../../services/process.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import {AccountDocumentHelperService} from './service/account-document-helper.service';
import { MspMaintenanceService } from '../../services/msp-maintenance.service';

import { AccountLetterComponent } from './account-letter/account-letter.component';
import { AccountLetterPersonalInfoComponent } from './account-letter/personal-info/personal-info.component';
import { AccountLetterSendingComponent } from './account-letter/sending/sending.component';
import { AccountLetterConfirmationComponent } from './account-letter/confirmation/confirmation.component';
import { SpecificMemberComponent } from './account-letter/personal-info/specific-member/specific-member.component';
import { AclErrorViewComponent } from './account-letter/sending/acl-error-view/acl-error-view.component';
import { CommonButtonGroupComponent } from './common/common-button-group/common-button-group.component';
import { CommonIncomeInputtextComponent } from './common/common-income-inputtext/common-income-inputtext.component';
import { CommonButtonComponent } from './common/common-button/common-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
// import { AuthorizeComponent } from '../../modules/enrolment/pages/authorize/authorize.component';
import { MspCoreModule } from '../../modules/msp-core/msp-core.module';



const APP_ROUTES: Routes = [
   // {
     //   path: 'msp',
     //   children: [
            // Start of Account Routes

            {
                path: 'account-letter',
                component: AccountLetterComponent,
                children: [
                    {
                        path: '',
                        canActivate: [],
                        redirectTo: 'personal-info',
                        pathMatch: 'full'
                    },
                    {
                        path: 'personal-info',
                        component: AccountLetterPersonalInfoComponent
                    },
                    {
                        path: 'sending',
                        component: AccountLetterSendingComponent,
                        canActivate: [ProcessService]
                    },
                    {
                        path: 'confirmation',
                        component: AccountLetterConfirmationComponent,
                        canActivate: [],
                    }

                ],
            },

   //     ]
 //   },
    {path: '**', redirectTo: '/'}
];

/**
 * The overall progress layout is created based on 'msp-prepare-v3-a.jpeg' in
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */


@NgModule({
    imports: [
     //   BrowserModule,
        NgSelectModule,
        CommonModule,
        FormsModule,
        MspCoreModule,
        ModalModule,
        HttpClientModule,
        TextMaskModule,
        RouterModule.forChild(APP_ROUTES),
        TypeaheadModule.forRoot(),
 //       LocalStorageModule.withConfig({
 //           prefix: 'ca.bc.gov.msp',
  //          storageType: 'sessionStorage'
 //       })
    ],
    declarations: [
        MspLoggerDirective,



        // Account Letter
        AccountLetterComponent,
        AccountLetterPersonalInfoComponent,
        AccountLetterSendingComponent,
        AccountLetterConfirmationComponent,
        SpecificMemberComponent,
        AclErrorViewComponent,


        CommonButtonGroupComponent,

        CommonIncomeInputtextComponent,
        CommonButtonComponent,
    ],

    providers: [

        MspValidationService,
        MspMaintenanceService,
        MspACLService,
        MspLog2Service,
        AccountDocumentHelperService,
    ]
})
@Injectable()
export class MspModule {

}
