import { ACCOUNT_PAGES } from "./account.constants";
import { AccountPersonalInfoComponent } from "./pages/personal-info/personal-info.component";
import { SpouseInfoComponent } from "./pages/spouse-info/spouse-info.component";
import { ChildInfoComponent } from "./pages/child-info/child-info.component";
import { AccountReviewComponent } from "./pages/review/review.component";
import { ContactInfoComponent } from "./pages/contact-info/contact-info.component";
import { AuthorizeComponent } from "./pages/authorize/authorize.component";
import { Routes } from "@angular/router";
import { RouteGuardService } from 'moh-common-lib';
import { AccountSendingComponent } from './pages/sending/sending.component';


export const accountPageRoutes: Routes = [
  {
    path: ACCOUNT_PAGES.PERSONAL_INFO.path,
    canActivate: [RouteGuardService],
    component: AccountPersonalInfoComponent,
    data: { title: ACCOUNT_PAGES.PERSONAL_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.SPOUSE_INFO.path,
    canActivate: [RouteGuardService],
    component: SpouseInfoComponent,
    data: { title: ACCOUNT_PAGES.SPOUSE_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CHILD_INFO.path,
    canActivate: [RouteGuardService],
    component: ChildInfoComponent,
    data: { title: ACCOUNT_PAGES.CHILD_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CONTACT_INFO.path,
    canActivate: [RouteGuardService],
    component: ContactInfoComponent,
    data: { title: ACCOUNT_PAGES.CONTACT_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.REVIEW.path,
    canActivate: [RouteGuardService],
    component: AccountReviewComponent,
    data: { title: ACCOUNT_PAGES.REVIEW.title },
  },
  {
    path: ACCOUNT_PAGES.AUTHORIZE.path,
    canActivate: [RouteGuardService],
    component: AuthorizeComponent,
    data: { title: ACCOUNT_PAGES.AUTHORIZE.title },
  },
  {
    path: ACCOUNT_PAGES.SENDING.path,
    canActivate: [RouteGuardService],
    component: AccountSendingComponent,
    data: { title: ACCOUNT_PAGES.SENDING.title },
  },
  {
    path: '',
    canActivate: [],
    redirectTo: ACCOUNT_PAGES.HOME.path,
    pathMatch: 'full',
  },
];
