import { ACCOUNT_PAGES } from "./account.constants";
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
    data: { title: ACCOUNT_PAGES.PERSONAL_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.SPOUSE_INFO.path,
    component: SpouseInfoComponent,
    data: { title: ACCOUNT_PAGES.SPOUSE_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CHILD_INFO.path,
    component: ChildInfoComponent,
    data: { title: ACCOUNT_PAGES.CHILD_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.CONTACT_INFO.path,
    component: ContactInfoComponent,
    data: { title: ACCOUNT_PAGES.CONTACT_INFO.title },
  },
  {
    path: ACCOUNT_PAGES.REVIEW.path,
    component: AccountReviewComponent,
    data: { title: ACCOUNT_PAGES.REVIEW.title },
  },
  {
    path: ACCOUNT_PAGES.AUTHORIZE.path,
    component: AuthorizeComponent,
    data: { title: ACCOUNT_PAGES.AUTHORIZE.title },
  },
  {
    path: '',
    redirectTo: ACCOUNT_PAGES.HOME.path,
    pathMatch: 'full',
  },
];
