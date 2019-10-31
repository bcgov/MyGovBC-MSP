import { Routes } from '@angular/router';
import { PrepareComponent } from './pages/prepare/prepare.component';
import { PersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { EnrolAddressComponent } from './pages/address/address.component';
import { ReviewComponent } from './pages/review/review.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';
import { ROUTES_ENROL } from './models/enrol-route-constants';
import { RouteGuardService } from 'moh-common-lib';


export const enrolPages: Routes = [
  {
    path: ROUTES_ENROL.CHECK_ELIG.path,
    component: PrepareComponent,
    data: { title: ROUTES_ENROL.CHECK_ELIG.title }
  },
 {
    path: ROUTES_ENROL.PERSONAL_INFO.path,
    canActivate: [RouteGuardService],
    component: PersonalInfoComponent,
    data: { title: ROUTES_ENROL.PERSONAL_INFO.title }
  },
  {
    path: ROUTES_ENROL.SPOUSE_INFO.path,
    canActivate: [RouteGuardService],
    component: SpouseInfoComponent,
    data: { title: ROUTES_ENROL.SPOUSE_INFO.title }
  },
  {
    path: ROUTES_ENROL.CHILD_INFO.path,
    canActivate: [RouteGuardService],
    component: ChildInfoComponent,
    data: { title: ROUTES_ENROL.CHILD_INFO.title }
  },
  {
    path: ROUTES_ENROL.CONTACT.path,
    canActivate: [RouteGuardService],
    component: EnrolAddressComponent
  },
  {
    path: ROUTES_ENROL.REVIEW.path,
    canActivate: [RouteGuardService],
    component: ReviewComponent,
    data: { title: ROUTES_ENROL.REVIEW.title }
  },
  {
    path: ROUTES_ENROL.AUTHORIZE.path,
    canActivate: [RouteGuardService],
    component: AuthorizeComponent,
    data: { title: ROUTES_ENROL.AUTHORIZE.title }
  },
  {
    path: '',
    redirectTo: ROUTES_ENROL.CHECK_ELIG.path,
    pathMatch: 'full'
  }
];
