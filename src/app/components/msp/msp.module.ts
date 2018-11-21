import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { LocalStorageModule } from 'angular-2-local-storage';
import { CaptchaDataService } from 'mygovbc-captcha-widget/src/app/captcha-data.service';
import { CaptchaComponent } from 'mygovbc-captcha-widget/src/app/captcha/captcha.component';
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
import { AddressComponent } from './application/address/address.component';
import { ApplicationComponent } from './application/application.component';
import { ConfirmationComponent } from './application/confirmation/confirmation.component';
import { PersonalDetailsComponent } from './application/personal-info/personal-details/personal-details.component';
import { PersonalInfoComponent } from './application/personal-info/personal-info.component';
import { PrepareComponent } from './application/prepare/prepare.component';
import { ReviewComponent } from './application/review/review.component';
import { SendingComponent } from './application/sending/sending.component';
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
import { MspAddressCardPartComponent } from './common/address-card-part/address-card-part.component';
import { MspAddressComponent } from './common/address/address.component';
import { MspArrivalDateComponent } from './common/arrival-date/arrival-date.component';
import { MspBirthDateComponent } from './common/birthdate/birthdate.component';
import { CalendarDayValidator } from './common/calendar/calendar-day.validator';
import { CalendarMonthValidator } from './common/calendar/calendar-month.validator';
import { CalendarYearFormatter } from './common/calendar/calendar-year-formatter.component';
import { CalendarYearValidator } from './common/calendar/calendar-year.validator';
import { MspCancelComponent } from './common/cancel/cancel.component';
import { MspConsentModalComponent } from './common/consent-modal/consent-modal.component';
import { MspContactCardComponent } from './common/contact-card/contact-card.component';
import { MspCountryComponent } from './common/country/country.component';
import { MspDateComponent } from './common/date/date.component';
import { MspDepartureDateComponent } from './common/departure-date/departure-date.component';
import { MspDischargeDateComponent } from './common/discharge-date/discharge-date.component';
import { FileUploaderComponent } from './common/file-uploader/file-uploader.component';
import { MspGenderComponent } from './common/gender/gender.component';
import { HealthNumberComponent } from './common/health-number/health-number.component';
import { MspIdReqModalComponent } from './common/id-req-modal/id-req-modal.component';
import { MspImageErrorModalComponent } from './common/image-error-modal/image-error-modal.component';
import { KeyboardEventListner } from './common/keyboard-listener/keyboard-listener.directive';
import { MspLoggerDirective } from './common/logging/msp-logger.directive';
import { MspNameComponent } from './common/name/name.component';
import { MspOutofBCRecordComponent } from './common/outof-bc/outof-bc.component';
import { MspPersonCardComponent } from './common/person-card/person-card.component';
import { MspPhnComponent } from './common/phn/phn.component';
import { Mod11CheckValidator } from './common/phn/phn.validator';
import { MspPhoneComponent } from './common/phone/phone.component';
import { MspProgressBarComponent } from './common/progressBar/progressBar.component';
import { MspProvinceComponent } from './common/province/province.component';
import { MspReturnDateComponent } from './common/return-date/return-date.component';
import { MspSchoolDateComponent } from './common/schoolDate/school-date.component';
import { ServicesCardDisclaimerModalComponent } from './common/services-card-disclaimer/services-card-disclaimer.component';
import { SinCheckValidator } from './common/sin/sin.validator';
import { MspStatusInCanadaRadioComponent } from './common/status-in-canada-radio/status-in-canada-radio.component';
import { ThumbnailComponent } from './common/thumbnail/thumbnail.component';
import { MspToggleComponent } from './common/toggle/toggle.component';
import { TransmissionErrorView } from './common/transmission-error-view/transmission-error-view.component';
import { LandingComponent } from './landing/landing.component';
import { MspComponent } from './msp.component';
import { CompletenessCheckService } from './service/completeness-check.service';
import { MspLogService } from './service/log.service';
import { MspApiService } from './service/msp-api.service';
import {MspLog2Service} from './service/msp-api.service';
import { MspDataService } from './service/msp-data.service';
import { MspValidationService } from './service/msp-validation.service';
import { ProcessService } from './service/process.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import {AccountDocumentHelperService} from './service/account-document-helper.service';
import { MspMaintenanceService } from "./service/msp-maintenance.service";


const APP_ROUTES: Routes = [
    {
        path: 'msp',
        children: [
            {
                path: '',
                component: LandingComponent
            },

            {
                path: 'application',
                component: ApplicationComponent,
                children: [
                    {
                        path: '',
                        canActivate: [],
                        redirectTo: 'prepare',
                        pathMatch: 'full'
                    },
                    {
                        path: 'prepare',
                        component: PrepareComponent
                    },
                    {
                        path: 'personal-info',
                        canActivate: [ProcessService],
                        component: PersonalInfoComponent
                    },
                    {
                        path: 'address',
                        canActivate: [ProcessService],
                        component: AddressComponent
                    },
                    {
                        path: 'review',
                        canActivate: [ProcessService],
                        component: ReviewComponent
                    },
                    {
                        path: 'sending',
                        canActivate: [ProcessService],
                        component: SendingComponent
                    },
                    {
                        path: 'confirmation',
                        canActivate: [],
                        component: ConfirmationComponent
                    },

                ],
            },
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
            }

        ]
    },
    {path: '**', redirectTo: '/msp'}
];

/**
 * The overall progress layout is created based on 'msp-prepare-v3-a.jpeg' in
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ModalModule,
        AccordionModule,
        HttpClientModule,
        RouterModule.forChild(APP_ROUTES),
        TypeaheadModule.forRoot(),
        LocalStorageModule.withConfig({
            prefix: 'ca.bc.gov.msp',
            storageType: 'sessionStorage'
        })
    ],
    declarations: [
        MspLoggerDirective,
        KeyboardEventListner,
        // General
        MspComponent,
        LandingComponent,
        MspNameComponent,
        MspBirthDateComponent,
        CalendarYearFormatter,
        CalendarYearValidator,
        CalendarDayValidator,
        CalendarMonthValidator,
        MspAddressComponent,
        MspProvinceComponent,
        MspCountryComponent,
        MspPhoneComponent,
        MspPhnComponent,
        HealthNumberComponent,
        MspArrivalDateComponent,
        MspDischargeDateComponent,
        MspDepartureDateComponent,
        MspReturnDateComponent,
        MspSchoolDateComponent,
        Mod11CheckValidator,
        SinCheckValidator,
        MspGenderComponent,
        MspProgressBarComponent,
        FileUploaderComponent,
        MspImageErrorModalComponent,
        ThumbnailComponent,
        TransmissionErrorView,
        MspOutofBCRecordComponent,
        MspConsentModalComponent,
        MspIdReqModalComponent,
        MspCancelComponent,
        CaptchaComponent,
        MspToggleComponent,
        MspDateComponent,

        // View cards
        MspPersonCardComponent,
        MspContactCardComponent,
        MspAddressCardPartComponent,

        // Application
        ApplicationComponent,
        PersonalDetailsComponent,
        PrepareComponent,
        PersonalInfoComponent,
        AddressComponent,
        ReviewComponent,
        SendingComponent,
        ConfirmationComponent,


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
        MspStatusInCanadaRadioComponent,
        AddNewDependentBeneficiaryComponent,
        MspAccordionComponent,
        ServicesCardDisclaimerModalComponent,
    ],

    providers: [
        // Services
        MspDataService,
        MspValidationService,
	MspMaintenanceService,
        CompletenessCheckService,
        MspApiService,
        MspLogService,
        MspLog2Service,
        ProcessService,
        CaptchaDataService,
        AccountDocumentHelperService
    ]
})
@Injectable()
export class MspModule {

}
