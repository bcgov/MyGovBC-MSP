import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
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
import { AssistanceComponent } from './assistance/assistance.component';
import { AssistanceAuthorizeSubmitComponent } from './assistance/authorize-submit/authorize-submit.component';
import { AssistanceConfirmationComponent } from './assistance/confirmation/confirmation.component';
import { AssistancePersonalDetailComponent } from './assistance/personal-info/personal-details/personal-details.component';
import { AssistancePersonalInfoComponent } from './assistance/personal-info/personal-info.component';
import { MspAssistanceYearComponent } from './assistance/prepare/assistance-year/assistance-year.component';
import { DeductionCalculatorComponent } from './assistance/prepare/deduction-calculator/deduction-calculator.component';
import { EligibilityCardComponent } from './assistance/prepare/eligibility-card/eligibility-card.component';
import { AssistancePrepareComponent } from './assistance/prepare/prepare.component';
import { AssistanceRetroYearsComponent } from './assistance/retro-years/retro-years.component';
import { AssistanceReviewComponent } from './assistance/review/review.component';
import { AssistanceSendingComponent } from './assistance/sending/sending.component';
import { MspAccordionComponent } from './common/accordion/accordion.component';
//import { MspAddressCardPartComponent } from './common/address-card-part/address-card-part.component';
import { TextMaskModule } from 'angular2-text-mask';
//import { MspContactCardComponent } from './common/contact-card/contact-card.component';
import { KeyboardEventListner } from '../../modules/msp-core/components/keyboard-listener/keyboard-listener.directive';
import { MspLoggerDirective } from './common/logging/msp-logger.directive';
//import { MspPersonCardComponent } from './common/person-card/person-card.component';
//import { LandingComponent } from '../../pages/landing/landing.component';
import { CompletenessCheckService } from '../../services/completeness-check.service';
import { MspLogService } from '../../services/log.service';
import { MspApiService } from './service/msp-api.service';
import { MspACLService } from './service/msp-acl-api.service';
import { MspLog2Service } from './service/log2.service';
import { MspDataService } from './service/msp-data.service';
import { MspValidationService } from '../../services/msp-validation.service';
import { ProcessService } from './service/process.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import {AccountDocumentHelperService} from './service/account-document-helper.service';
import { MspMaintenanceService } from './service/msp-maintenance.service';

import { AccountLetterComponent } from './account-letter/account-letter.component';
import { AccountLetterPersonalInfoComponent } from './account-letter/personal-info/personal-info.component';
import { AccountLetterSendingComponent } from './account-letter/sending/sending.component';
import { AccountLetterConfirmationComponent } from './account-letter/confirmation/confirmation.component';
import { SpecificMemberComponent } from './account-letter/personal-info/specific-member/specific-member.component';
import { AclErrorViewComponent } from './account-letter/sending/acl-error-view/acl-error-view.component';
import { ReplacewithlinksPipe } from './common/replace-link-pipe/replacewithlinks.pipe';
import {BenefitPrepareComponent} from '../../modules/benefit/pages/prepare/prepare.component';
import {MspBenefitDataService} from './service/msp-benefit-data.service';
import { BenefitDeductionCalculatorComponent } from '../../modules/benefit/pages/prepare/benefit-deduction-calculator/benefit-deduction-calculator.component';
import {BenefitPersonalInfoComponent} from '../../modules/benefit/pages/personal-info/personal-info.component';
import {BenefitPersonalDetailComponent} from '../../modules/benefit/pages/personal-info/personal-detail/personal-detail.component';
import {BenefitDocumentsComponent} from '../../modules/benefit/pages/documents/documents.component';
import {BenefitReviewComponent} from '../../modules/benefit/pages/review/review.component';
import {BenefitEligibilityCardComponent} from '../../modules/benefit/pages/prepare/eligibility-card/eligibility-card.component';
import { BenefitAuthorizeSubmitComponent } from '../../modules/benefit/pages/authorize-submit/authorize-submit.component';
import {BenefitSendingComponent} from '../../modules/benefit/pages/sending/sending.component';
import {BenefitConfirmationComponent} from '../../modules/benefit/pages/confirmation/confirmation.component';
import { TaxYearComponent } from '../../modules/benefit/pages/prepare/tax-year/tax-year.component';
import { CommonButtonGroupComponent } from './common/common-button-group/common-button-group.component';
import { CommonDeductionCalculatorComponent } from '../../modules/msp-core/components/common-deduction-calculator/common-deduction-calculator.component';
import { CommonIncomeInputtextComponent } from './common/common-income-inputtext/common-income-inputtext.component';
import { CommonButtonComponent } from './common/common-button/common-button.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpouseInfoComponent } from '../../modules/enrolment/pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from '../../modules/enrolment/pages/child-info/child-info.component';
// import { AuthorizeComponent } from '../../modules/enrolment/pages/authorize/authorize.component';
import { MspCoreModule } from '../../modules/msp-core/msp-core.module';
import { SharedCoreModule } from 'moh-common-lib';



const APP_ROUTES: Routes = [
   // {
     //   path: 'msp',
     //   children: [
    /*        {
                path: '',
                component: LandingComponent
            },
            {
                path: 'enrolment',
                loadChildren: 'app/modules/enrolment/enrolment.module#EnrolmentModule'
            },*/
            {
                path: 'assistance',
                component: AssistanceComponent,
                children: [
                    {
                        path: '',
                        redirectTo: 'prepare',
                        pathMatch: 'full'
                    },
                    {
                        path: 'prepare',
                        component: AssistancePrepareComponent
                    },
                    {
                        path: 'personal-info',
                        canActivate: [ProcessService],
                        component: AssistancePersonalInfoComponent,

                    },
                    {
                        path: 'retro',
                        canActivate: [ProcessService],
                        component: AssistanceRetroYearsComponent
                    },
                    {
                        path: 'review',
                        canActivate: [ProcessService],
                        component: AssistanceReviewComponent
                    },
                    {
                        path: 'authorize-submit',
                        canActivate: [ProcessService],
                        component: AssistanceAuthorizeSubmitComponent
                    },
                    {
                        path: 'sending',
                        canActivate: [ProcessService],
                        component: AssistanceSendingComponent
                    },
                    {
                        path: 'confirmation',
                        canActivate: [],
                        component: AssistanceConfirmationComponent
                    }
                ]
            },
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
        AssistanceComponent,
        AssistancePrepareComponent,
        AssistancePersonalInfoComponent,
        AssistancePersonalDetailComponent,
        AssistanceReviewComponent,
        AssistanceRetroYearsComponent,
        AssistanceAuthorizeSubmitComponent,
        AssistanceSendingComponent,
        AssistanceConfirmationComponent,
        DeductionCalculatorComponent,
        MspAssistanceYearComponent,

        EligibilityCardComponent,

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
        CompletenessCheckService,
        MspApiService,
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
