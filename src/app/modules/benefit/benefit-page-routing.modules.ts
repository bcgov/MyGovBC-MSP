import { Routes } from '@angular/router';
import { BenefitPrepareComponent } from './pages/financial-info/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { ProcessService } from '../../services/process.service';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';
import { BenefitSpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { BenefitAddressComponent } from './pages/contact-info/address.component';
import { EligibilityComponent } from './pages/eligibility/eligibility.component';
import { RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { environment } from 'environments/environment';

export const benefitPages: Routes = [
    {
        path: 'financial-info',
        canActivate: [ProcessService],
        component: BenefitPrepareComponent
    },
    {
        path: 'personal-info',
        canActivate: [ProcessService],
        component: BenefitPersonalInfoComponent,

    }, {
        path: 'spouse-info',
        canActivate: [ProcessService],
        component: BenefitSpouseInfoComponent,

    }, /*{
        path: 'contact-info',
    // canActivate: [RouteGuardService],
        component: BenefitSpouseInfoComponent,

    },*/{
        path: 'contact-info',
        canActivate: [ProcessService],
        component: BenefitAddressComponent
    }, {
        path: 'review',
        canActivate: [ProcessService],
        component: BenefitReviewComponent
    }, {
        path: 'authorize',
        canActivate: [ProcessService],
        component: BenefitAuthorizeSubmitComponent
    }, {
        path: 'sending',
        canActivate: [ProcessService],
        component: BenefitSendingComponent
    },
    {
        path: '',
        canActivate: [],
        redirectTo: 'eligibility',
        pathMatch: 'full'
    }
];

export let routes = benefitPages;
if (environment.bypassGuards) {
    console.log('DEVELOPMENT ONLY - BYPASSING ROUTE GUARDS');
    routes = routes.map(x => {
        x.canActivate = [];
        return x;
    });
}

export const displayedbenefitPages = benefitPages.filter(x => (x.path !== 'sending'));
