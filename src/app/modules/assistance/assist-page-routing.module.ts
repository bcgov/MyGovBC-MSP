import { Routes } from '@angular/router';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { SpouseComponent } from './pages/spouse/spouse.component';
import { AssistGuard } from './guards/assist.guard';
import { environment } from 'environments/environment';

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
    canActivate: [AssistGuard],
    component: AssistanceHomeComponent
  },
  {
    path: 'personal-info',
    canActivate: [AssistGuard],
    component: AssistancePersonalInfoComponent
  },
  {
    path: 'spouse',
    canActivate: [AssistGuard],
    component: SpouseComponent
  },

  {
    path: 'contact',
    canActivate: [AssistGuard],
    component: AssistContactComponent
  },

  {
    path: 'review',
    canActivate: [AssistGuard],
    component: AssistanceReviewComponent
  },

  {
    path: 'authorize-submit',
    canActivate: [AssistGuard],
    component: AssistanceAuthorizeSubmitComponent
  },

  {
    path: '',
    redirectTo: 'home'
  }
];

export let routes = assistPages;
 if (environment.bypassGuards) {
    console.log('DEVELOPMENT ONLY - BYPASSING ROUTE GUARDS');
     routes = routes.map(x => {
           x.canActivate = [];
         return x;
     });
 }
