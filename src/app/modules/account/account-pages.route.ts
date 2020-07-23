import { ACCOUNT_PAGES } from "./account.constants";
import { ProcessService } from '../../services/process.service';
import { AccountPersonalInfoComponent } from "./pages/personal-info/personal-info.component";
import { SpouseInfoComponent } from "./pages/spouse-info/spouse-info.component";
import { ChildInfoComponent } from "./pages/child-info/child-info.component";
import { AccountReviewComponent } from "./pages/review/review.component";
import { ContactInfoComponent } from "./pages/contact-info/contact-info.component";
import { AuthorizeComponent } from "./pages/authorize/authorize.component";
import { Routes } from "@angular/router";


export const accountPageRoutes: Routes = [
  {
    path: ACCOUNT_PAGES.PERSONAL_INFO.path,
    component: AccountPersonalInfoComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.PERSONAL_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.SPOUSE_INFO.path,
    component: SpouseInfoComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.SPOUSE_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CHILD_INFO.path,
    component: ChildInfoComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.CHILD_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CONTACT_INFO.path,
    component: ContactInfoComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.CONTACT_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.REVIEW.path,
    component: AccountReviewComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.REVIEW.title },
  },
  {
    path: ACCOUNT_PAGES.AUTHORIZE.path,
    component: AuthorizeComponent,
    canActivate: [ProcessService],
    data: { title: ACCOUNT_PAGES.AUTHORIZE.title },
  },
  {
    path: '',
    canActivate: [],
    redirectTo: ACCOUNT_PAGES.HOME.path,
    pathMatch: 'full',
  },
];
