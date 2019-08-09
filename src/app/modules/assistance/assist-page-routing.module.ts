import { Routes } from '@angular/router';
import { AssistancePersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AssistanceReviewComponent } from './pages/review/review.component';
import { AssistanceAuthorizeSubmitComponent } from './pages/authorize-submit/authorize-submit.component';
import { AssistContactComponent } from './pages/contact/assist-contact.component';
import { AssistanceHomeComponent } from './pages/home/home.component';
import { SpouseComponent } from './pages/spouse/spouse.component';
import { ROUTES_ASSIST } from './models/assist-route-constants';
import { RouteGuardService } from 'moh-common-lib';

export const assistPages: Routes = [
  {
    path: ROUTES_ASSIST.HOME.path,
    component: AssistanceHomeComponent,
    data: { title: ROUTES_ASSIST.HOME.title }
  },
  {
    path: ROUTES_ASSIST.PERSONAL_INFO.path,
    component: AssistancePersonalInfoComponent,
    data: { title: ROUTES_ASSIST.PERSONAL_INFO.title },
    canActivate: [RouteGuardService]
  },
  {
    path: ROUTES_ASSIST.SPOUSE_INFO.path,
    component: SpouseComponent,
    data: { title: ROUTES_ASSIST.SPOUSE_INFO.title },
    canActivate: [RouteGuardService]
  },

  {
    path: ROUTES_ASSIST.CONTACT.path,
    component: AssistContactComponent,
    data: { title: ROUTES_ASSIST.CONTACT.title },
    canActivate: [RouteGuardService]
  },
  {
    path: ROUTES_ASSIST.REVIEW.path,
    component: AssistanceReviewComponent,
    data: { title: ROUTES_ASSIST.REVIEW.title },
    canActivate: [RouteGuardService]
  },
  {
    path: ROUTES_ASSIST.AUTHORIZE.path,
    component: AssistanceAuthorizeSubmitComponent,
    data: { title: ROUTES_ASSIST.AUTHORIZE.title },
    canActivate: [RouteGuardService]
  },
  {
    path: '',
    redirectTo: ROUTES_ASSIST.HOME.path
  }
];

export let routes = assistPages;
/* if (environment.bypassGuards) {
    console.log('DEVELOPMENT ONLY - BYPASSING ROUTE GUARDS');
     routes = routes.map(x => {
           x.canActivate = [];
         return x;
     });
 }*/
