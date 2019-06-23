import { Routes } from '@angular/router';
import { AssistancePrepareComponent } from './pages/prepare/prepare.component';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistanceRetroYearsComponent } from './pages/retro-years/retro-years.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistanceSendingComponent } from './pages/sending/sending.component';
import { AssistanceConfirmationComponent } from './pages/confirmation/confirmation.component';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { AssistRatesHelperModalComponent } from './components/assist-rates-helper-modal/assist-rates-helper-modal.component';
import { SpouseComponent } from './pages/spouse/spouse.component';

export const assistPages: Routes = [
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
    //canActivate: [ProcessService],
    component: AssistancePersonalInfoComponent
  },
  {
    path: 'retro',
    //canActivate: [ProcessService],
    component: AssistanceRetroYearsComponent
  },
  {
    path: 'review',
    // canActivate: [ProcessService],
    component: AssistanceReviewComponent
  },
  {
    path: 'authorize-submit',
    // canActivate: [ProcessService],
    component: AssistanceAuthorizeSubmitComponent
  },
  {
    path: 'sending',
    // canActivate: [ProcessService],
    component: AssistanceSendingComponent
  },
  {
    path: 'contact',
    // canActivate: [ProcessService],
    component: AssistContactComponent
  },
  {
    path: 'home',
    // canActivate: [ProcessService],
    component: AssistanceHomeComponent
  },
  {
    path: 'confirmation',
    canActivate: [],
    component: AssistanceConfirmationComponent
  },
  {
    path: 'spouse',
    canActivate: [],
    component: SpouseComponent
  },
  {
    path: '',
    redirectTo: 'prepare'
  }
];
