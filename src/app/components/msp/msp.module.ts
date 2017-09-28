import {NgModule, Injectable} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser'

import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import { AlertModule, ModalModule, AccordionModule} from 'ngx-bootstrap';


import {Ng2CompleterModule} from "ng2-completer";

//ARC TODO - Temporarily removed while AoT compilation is failing!
// let CaptchaComponent = require("mygovbc-captcha-widget/component").CaptchaComponent;

import {MspComponent} from './msp.component';
import {LandingComponent} from './landing/landing.component';
import {MspNameComponent} from './common/name/name.component';
import {MspBirthDateComponent} from './common/birthdate/birthdate.component';
import {CalendarYearFormatter} from './common/calendar/calendar-year-formatter.component';
import {CalendarYearValidator} from './common/calendar/calendar-year.validator';
import {CalendarDayValidator} from './common/calendar/calendar-day.validator';
import {CalendarMonthValidator} from './common/calendar/calendar-month.validator';
import {MspAddressComponent} from './common/address/address.component';
import {MspProvinceComponent} from './common/province/province.component';
import {MspCountryComponent} from './common/country/country.component';
import {MspPhoneComponent} from './common/phone/phone.component';
import {MspProgressBarComponent} from './common/progressBar/progressBar.component';
import {MspPhnComponent} from './common/phn/phn.component';
import {HealthNumberComponent} from './common/health-number/health-number.component';
import {MspArrivalDateComponent} from './common/arrival-date/arrival-date.component';
import {MspDischargeDateComponent} from './common/discharge-date/discharge-date.component';
import {MspDepartureDateComponent} from './common/departure-date/departure-date.component';
import {MspReturnDateComponent} from "./common/return-date/return-date.component";
import {MspSchoolDateComponent} from './common/schoolDate/school-date.component';
import {Mod11CheckValidator} from './common/phn/phn.validator';
import {SinCheckValidator} from './common/sin/sin.validator';
import {MspGenderComponent} from './common/gender/gender.component';
import {FileUploaderComponent} from './common/file-uploader/file-uploader.component';
import {MspImageErrorModalComponent} from './common/image-error-modal/image-error-modal.component';
import {ThumbnailComponent} from './common/thumbnail/thumbnail.component';
import {TransmissionErrorView} from './common/transmission-error-view/transmission-error-view.component';
import {MspOutofBCRecordComponent} from "./common/outof-bc/outof-bc.component";
import {MspConsentModalComponent} from "./common/consent-modal/consent-modal.component";
import {MspIdReqModalComponent} from "./common/id-req-modal/id-req-modal.component";
import {MspCancelComponent} from "./common/cancel/cancel.component";
import {MspLoggerDirective} from "./common/logging/msp-logger.directive";
import {KeyboardEventListner} from "./common/keyboard-listener/keyboard-listener.directive";
//import {MspLoggerComponent} from "./common/logging/msp-logger.component";


import {MspPersonCardComponent} from './common/person-card/person-card.component';
import {MspContactCardComponent} from './common/contact-card/contact-card.component';
import {MspAddressCardPartComponent} from './common/address-card-part/address-card-part.component';

import {MspDataService} from './service/msp-data.service';
import { MspValidationService } from './service/msp-validation.service';
import { CompletenessCheckService } from './service/completeness-check.service';

import {ApplicationComponent} from './application/application.component';
import {PersonalDetailsComponent} from './application/personal-info/personal-details/personal-details.component';
import {PrepareComponent} from './application/prepare/prepare.component';
import {PersonalInfoComponent} from './application/personal-info/personal-info.component';
import {AddressComponent} from './application/address/address.component';
import {ReviewComponent} from './application/review/review.component';
import {SendingComponent} from './application/sending/sending.component';
import {ConfirmationComponent} from './application/confirmation/confirmation.component';

import {AssistanceComponent} from './assistance/assistance.component';
import {AssistancePrepareComponent} from './assistance/prepare/prepare.component';
import {AssistancePersonalInfoComponent} from './assistance/personal-info/personal-info.component';
import {AssistancePersonalDetailComponent} from './assistance/personal-info/personal-details/personal-details.component';
import {AssistanceReviewComponent} from './assistance/review/review.component';
import {AssistanceRetroYearsComponent} from './assistance/retro-years/retro-years.component';
import {AssistanceAuthorizeSubmitComponent} from './assistance/authorize-submit/authorize-submit.component';
import {AssistanceSendingComponent} from './assistance/sending/sending.component';
import {AssistanceConfirmationComponent} from './assistance/confirmation/confirmation.component';
import {DeductionCalculatorComponent} from './assistance/prepare/deduction-calculator/deduction-calculator.component';
import {MspAssistanceYearComponent} from './assistance/prepare/assistance-year/assistance-year.component';
import {EligibilityCardComponent} from './assistance/prepare/eligibility-card/eligibility-card.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspApiService} from "./service/msp-api.service";
import {MspLogService} from "./service/log.service"
import {ProcessService} from "./service/process.service";

import {AccountComponent} from './account/account.component';
import {AccountPrepareComponent} from "./account/prepare/prepare.component";
import {AccountPersonalInfoComponent} from "./account/personal-info/personal-info.component";
import {AccountDependentChangeComponent} from "./account/dependent-change/dependent-change.component";


let localStorageServiceConfig = {
    prefix: 'ca.bc.gov.msp',
    storageType: 'sessionStorage'
};

/**
 * The overall progress layout is created based on 'msp-prepare-v3-a.jpeg' in
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */
@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,

        AlertModule,
        ModalModule,
        AccordionModule,
        Ng2CompleterModule,

        RouterModule.forChild([
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
                                component: AccountPersonalInfoComponent
                            },
                            {
                                path: 'dependent-change',
                                component: AccountDependentChangeComponent

                            }

                    ]
                    }

                ]
            },
            {path: '**', redirectTo: '/msp'}
        ]),

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
        // CaptchaComponent, //TODO - Temp commented out for --aot compilation

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
        AccountDependentChangeComponent
    ],

    providers: [
        // Services
        MspDataService,
        MspValidationService,


        CompletenessCheckService,
        MspApiService,
        MspLogService,
        ProcessService,
    ]
})
@Injectable()
export class MspModule {

}
