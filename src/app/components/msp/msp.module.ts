import {NgModule, Injectable} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MspComponent} from './msp.component';
import {LandingComponent} from './landing/landing.component';
import {ApplicationComponent} from './application/application.component';
import {PrepareComponent} from './application/prepare/prepare.component';
import {PersonalInfoComponent} from './application/personal-info/personal-info.component';
import {DocumentsComponent} from './application/documents/documents.component';
import {AddressComponent} from './application/address/address.component';
import {ReviewComponent} from './application/review/review.component';
import {ConfirmationComponent} from './application/confirmation/confirmation.component';

/**
 * The overall progress layout is created based on 'msp-prepare-v3-a.jpeg' in
 * https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-255?filter=16000
 */
@NgModule({
    imports: [
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

                        ]
                    }
                ]
            }
        ])

    ],
    declarations: [
        MspComponent,
        LandingComponent,
        ApplicationComponent,
        PrepareComponent,
        PersonalInfoComponent,
        DocumentsComponent,
        AddressComponent,
        ReviewComponent,
        ConfirmationComponent
    ],

    exports: []
})
@Injectable()
export class MspModule {

}