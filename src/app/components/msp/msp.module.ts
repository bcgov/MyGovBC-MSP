import {NgModule, Injectable} from '@angular/core';
import {BrowserModule}  from '@angular/platform-browser'

import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

import { AlertModule } from 'ng2-bootstrap/components/alert';
import { ProgressbarModule } from 'ng2-bootstrap/components/progressbar';
import { ModalModule } from 'ng2-bootstrap/components/modal';

import {MspComponent} from './msp.component';
import {LandingComponent} from './landing/landing.component';
import {MspNameComponent} from './common/name/name.component';
import {MspBirthDateComponent} from './common/birthdate/birthdate.component';
import {MspAddressComponent} from './common/address/address.component';
import {MspPhoneComponent} from './common/phone/phone.component';
import {MspProgressBarComponent} from './common/progressBar/progressBar.component';

import MspApplicationDataService from './application/application-data.service';
import {ApplicationComponent} from './application/application.component';
import {PersonalDetailsComponent} from './application/personal-info/personal-details/personal-details.component';
import {PrepareComponent} from './application/prepare/prepare.component';
import {PersonalInfoComponent} from './application/personal-info/personal-info.component';
import {DocumentsComponent} from './application/documents/documents.component';
import {AddressComponent} from './application/address/address.component';
import {ReviewComponent} from './application/review/review.component';
import {ConfirmationComponent} from './application/confirmation/confirmation.component';
import {FileUploaderComponent} from './common/file-uploader/file-uploader.component';
import {ThumbnailComponent} from './common/thumbnail/thumbnail.component';

import {AssistanceComponent} from './assistance/assistance.component';
import {AssistancePrepareComponent} from './assistance/prepare/prepare.component';
import {AssistancePersonalInfoComponent} from './assistance/personal-info/personal-info.component';
import {AssistancePersonalDetailComponent} from './assistance/personal-info/personal-details/personal-details.component';
import {AssistanceReviewComponent} from './assistance/review/review.component';
import {AssistanceAuthorizeSubmitComponent} from './assistance/authorize-submit/authorize-submit.component';
import {AssistanceConfirmationComponent} from './assistance/confirmation/confirmation.component';
import {DeductionCalculatorComponent} from './assistance/prepare/deduction-calculator/deduction-calculator.component';
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
    ProgressbarModule,
    ModalModule,
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
                redirectTo: 'prepare',
                pathMatch: 'full'
              },
              {
                path: 'prepare',
                component: PrepareComponent
              },
              {
                path: 'personal-info',
                component: PersonalInfoComponent
              },
              {
                path: 'documents',
                component: DocumentsComponent
              },
              {
                path: 'address',
                component: AddressComponent
              },
              {
                path: 'review',
                component: ReviewComponent
              },
              {
                path: 'confirmation',
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
                component: AssistancePersonalInfoComponent,
              },
              {
                path: 'review',
                component: AssistanceReviewComponent
              },
              {
                path: 'authorize-submit',
                component: AssistanceAuthorizeSubmitComponent
              },
              {
                path: 'confirmation',
                component: AssistanceConfirmationComponent
              }
            ]
          }
        ]
      }
    ])

  ],
  declarations: [
    // General
    MspComponent,
    LandingComponent,
    MspNameComponent,
    MspBirthDateComponent,
    MspAddressComponent,
    MspPhoneComponent,
    MspProgressBarComponent,
    FileUploaderComponent,
    ThumbnailComponent,

    // Application
    ApplicationComponent,
    PersonalDetailsComponent,
    PrepareComponent,
    PersonalInfoComponent,
    DocumentsComponent,
    AddressComponent,
    ReviewComponent,
    ConfirmationComponent,

    // Assistance
    AssistanceComponent,
    AssistancePrepareComponent,
    AssistancePersonalInfoComponent,
    AssistancePersonalDetailComponent,
    AssistanceReviewComponent,
    AssistanceAuthorizeSubmitComponent,
    AssistanceConfirmationComponent,
    DeductionCalculatorComponent
  ],

  providers: [
    // Services
    MspApplicationDataService
  ]
})
@Injectable()
export class MspModule {

}