import { Routes } from '@angular/router';
import { BenefitPrepareComponent } from './pages/financial-info/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { ProcessService } from '../../services/process.service';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitSpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { BenefitAddressComponent } from './pages/contact-info/address.component';
import { environment } from 'environments/environment';

export const benefitPages: Routes = [
    {
        path: 'financial-info',
        canActivate: [ProcessService],
        component: BenefitPrepareComponent,
        data: { title: 'Financial Info - MSP Supplementary Benefits' }
    },
    {
        path: 'personal-info',
        canActivate: [ProcessService],
        component: BenefitPersonalInfoComponent,
        data: { title: 'Personal Info - MSP Supplementary Benefits' }
    }, {
        path: 'spouse-info',
        canActivate: [ProcessService],
        component: BenefitSpouseInfoComponent,
        data: { title: 'Spouse Info - MSP Supplementary Benefits' }
    }, {
        path: 'contact-info',
        canActivate: [ProcessService],
        component: BenefitAddressComponent,
        data: { title: 'Contact Info - MSP Supplementary Benefits' }
    }, {
        path: 'review',
        canActivate: [ProcessService],
        component: BenefitReviewComponent,
        data: { title: 'Review - MSP Supplementary Benefits' }
    }, {
        path: 'authorize',
        canActivate: [ProcessService],
        component: BenefitAuthorizeSubmitComponent,
        data: { title: 'Authorize - MSP Supplementary Benefits' }
    }, {
        path: 'sending',
        canActivate: [ProcessService],
        component: BenefitSendingComponent,
        data: { title: 'Sending - MSP Supplementary Benefits' }
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
    routes = routes.map(x => {
        x.canActivate = [];
        return x;
    });
}

export const displayedbenefitPages = benefitPages.filter(x => (x.path !== 'sending'));
