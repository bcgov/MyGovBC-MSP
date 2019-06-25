import { Routes } from '@angular/router';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { SpouseComponent } from './pages/spouse/spouse.component';

export const assistPages: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: 'prepare',
  //   component: AssistancePrepareComponent
  // },
  {
    path: 'home',
    // canActivate: [ProcessService],
    component: AssistanceHomeComponent
  },
  {
    path: 'personal-info',
    //canActivate: [ProcessService],
    component: AssistancePersonalInfoComponent
  },
  {
    path: 'spouse',
    canActivate: [],
    component: SpouseComponent
  },

  {
    path: 'contact',
    // canActivate: [ProcessService],
    component: AssistContactComponent
  },
  // {
  //   path: 'retro',
  //   //canActivate: [ProcessService],
  //   component: AssistanceRetroYearsComponent
  // },
  {
    path: 'review',
    // canActivate: [ProcessService],
    component: AssistanceReviewComponent
  },

  // {
  //   path: 'sending',
  //   // canActivate: [ProcessService],
  //   component: AssistanceSendingComponent
  // },

  {
    path: 'authorize-submit',
    // canActivate: [ProcessService],
    component: AssistanceAuthorizeSubmitComponent
  },
  // {
  //   path: 'confirmation',
  //   canActivate: [],
  //   component: AssistanceConfirmationComponent
  // },

  {
    path: '',
    redirectTo: 'home'
  }
];
