import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, ModalModule } from 'ngx-bootstrap';
import { AccountComponent } from './account/account.component';
import { AddDependentComponent } from './account/add-dependents/add-dependents.component';
import { AddNewDependentBeneficiaryComponent } from './account/add-dependents/add-new-dependent-beneficiary/add-new-dependent-beneficiary.component';
import { AccountConfirmationComponent } from './account/confirmation/confirmation.component';
import { AccountDependentChangeComponent } from './account/dependent-change/dependent-change.component';
import { AccountDocumentsComponent } from './account/documents/documents.component';
import { AccountPersonalDetailsComponent } from './account/personal-info/personal-details/personal-details.component';
import { AccountPersonalInfoComponent } from './account/personal-info/personal-info.component';
import { AccountPrepareComponent } from './account/prepare/prepare.component';
import { RemoveDependentComponent } from './account/remove-dependents/remove-dependents.component';
import { AccountReviewComponent } from './account/review/review.component';
import { AccountSendingComponent } from './account/sending/sending.component';
import { MspAccordionComponent } from './common/accordion/accordion.component';
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
                path: 'account',
                component: AccountComponent,
                children: [
                    {
                        path: '',
                        canActivate: [],
                        redirectTo: 'prepare',
                        pathMatch: 'full'
                    },
                    {
                        path: 'prepare',
                        component: AccountPrepareComponent
                    },
                    {
                        path: 'personal-info',
                        component: AccountPersonalInfoComponent,
                        canActivate: [ProcessService],
                    },
                    {
                        path: 'dependent-change',
                        component: AccountDependentChangeComponent,
                        canActivate: [ProcessService],

                    },
                    {
                        path: 'documents',
                        component: AccountDocumentsComponent,
                        canActivate: [ProcessService],
                    },
                    {
                        path: 'review',
                        component: AccountReviewComponent,
                        canActivate: [ProcessService],
                    },
                    {
                        path: 'sending',
                        component: AccountSendingComponent,
                        canActivate: [ProcessService],
                    },
                    {
                        path: 'confirmation',
                        component: AccountConfirmationComponent,
                        canActivate: [],
                    }
            ]
            },

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
        AccordionModule,
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
        //KeyboardEventListner,

        // View cards
     //   MspPersonCardComponent,
     //   MspContactCardComponent,
     //   MspAddressCardPartComponent,

        // Assistance
        //AssistanceComponent,
        //AssistancePrepareComponent,
       // AssistancePersonalInfoComponent,
       // AssistancePersonalDetailComponent,
       // AssistanceReviewComponent,
       // AssistanceRetroYearsComponent,
       // AssistanceAuthorizeSubmitComponent,
       // AssistanceSendingComponent,
        //AssistanceConfirmationComponent,
        //DeductionCalculatorComponent,
        //MspAssistanceYearComponent,

       // EligibilityCardComponent,

        //Account

        AccountComponent,
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


        // Account Letter
        AccountLetterComponent,
        AccountLetterPersonalInfoComponent,
        AccountLetterSendingComponent,
        AccountLetterConfirmationComponent,
        SpecificMemberComponent,
        AclErrorViewComponent,

       //BenefitComponent,
        //BenefitPrepareComponent,
        //BenefitPersonalInfoComponent,
        //BenefitPersonalDetailComponent,
        //BenefitDeductionCalculatorComponent,
        //BenefitDocumentsComponent,
        //BenefitReviewComponent,
        //BenefitEligibilityCardComponent,
        //BenefitAuthorizeSubmitComponent,
        //BenefitSendingComponent,
        //BenefitConfirmationComponent,
        //TaxYearComponent,

        CommonButtonGroupComponent,
        //CommonDeductionCalculatorComponent,
        CommonIncomeInputtextComponent,
        CommonButtonComponent,
    ],

    providers: [
        // Services
        //MspDataService,
        MspValidationService,
        MspMaintenanceService,
        //CompletenessCheckService,
        //MspApiService,
        MspACLService,
        //MspLogService,
        MspLog2Service,
      //  ProcessService,
        AccountDocumentHelperService,
        //MspBenefitDataService
    ]
})
@Injectable()
export class MspModule {

}
