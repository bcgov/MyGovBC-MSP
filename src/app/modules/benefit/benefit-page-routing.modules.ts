import { Routes } from '@angular/router';
import { BenefitPrepareComponent } from './pages/prepare/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { ProcessService } from '../../services/process.service';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';
import { BenefitSpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { BenefitAddressComponent } from './pages/address/address.component';
import { RouteGuardService, AbstractPgCheckService } from 'moh-common-lib';
import { environment } from 'environments/environment';

export const benefitPages: Routes = [
  {
    path: '',
    redirectTo: 'financial-info',
    pathMatch: 'full'
},
{
    path: 'financial-info',
    component: BenefitPrepareComponent
},
{
    path: 'personal-info',
    canActivate: [ProcessService],
    component: BenefitPersonalInfoComponent,

},{
    path: 'spouse-info',
    canActivate: [ProcessService],
    component: BenefitSpouseInfoComponent,

},/*{
    path: 'contact-info',
   // canActivate: [RouteGuardService],
    component: BenefitSpouseInfoComponent,

},*/{
     path: 'contact-info',
     canActivate: [ProcessService],
     component: BenefitAddressComponent
},{
    path: 'review',
    canActivate: [ProcessService],
    component: BenefitReviewComponent
},{
     path: 'authorize',
     canActivate: [ProcessService],
     component: BenefitAuthorizeSubmitComponent
},{
      path: 'sending',
      canActivate: [ProcessService],
      component: BenefitSendingComponent
 },{
      path: 'confirmation',
      canActivate: [],
      component: BenefitConfirmationComponent
  },{
    path: '',
    redirectTo: 'financial-info'
  }
];

export let routes = benefitPages;
if (environment.bypassGuards || true ) {
    console.log('DEVELOPMENT ONLY - BYPASSING ROUTE GUARDS');
    routes = routes.map(x => {
        x.canActivate = [];
        return x;
    });
}

export const displayedbenefitPages = benefitPages.filter(x => (x.path !== 'sending' && x.path !== 'confirmation'));
