import { Routes } from '@angular/router';
import { BenefitPrepareComponent } from './pages/prepare/prepare.component';
import { BenefitPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { BenefitDocumentsComponent } from './pages/documents/documents.component';
import { ProcessService } from '../../services/process.service';
import { BenefitReviewComponent } from './pages/review/review.component';
import { BenefitAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { BenefitSendingComponent } from './pages/sending/sending.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';


export const benefitPages: Routes = [
  {
    path: '',
    redirectTo: 'prepare',
    pathMatch: 'full'
},
{
    path: 'prepare',
    component: BenefitPrepareComponent
},
{
    path: 'personal-info',
   // canActivate: [ProcessService],
    component: BenefitPersonalInfoComponent,

},
 {
     path: 'documents',
     //canActivate: [ProcessService],
     component: BenefitDocumentsComponent
 },
{
    path: 'review',
    //canActivate: [ProcessService],
    component: BenefitReviewComponent
},
 {
     path: 'authorize-submit',
     //canActivate: [ProcessService],
     component: BenefitAuthorizeSubmitComponent
 },
   {
      path: 'sending',
      //canActivate: [ProcessService],
      component: BenefitSendingComponent
  },
  {
      path: 'confirmation',
      canActivate: [],
      component: BenefitConfirmationComponent
  },
  {
    path: '',
    redirectTo: 'prepare'
  }
];
