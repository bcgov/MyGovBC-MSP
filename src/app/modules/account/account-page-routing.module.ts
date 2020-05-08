import { Routes } from '@angular/router';
import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountReviewComponent } from './pages/review/review.component';
import { SpouseInfoComponent } from './pages/spouse-info/spouse-info.component';
import { ChildInfoComponent } from './pages/child-info/child-info.component';
import { ContactInfoComponent } from './pages/contact-info/contact-info.component';
import { AuthorizeComponent } from './pages/authorize/authorize.component';

import { AccountSendingComponent } from './pages/sending/sending.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';

export const accountPages: Routes = [
  {
    path: '',
    canActivate: [],
    redirectTo: 'personal-info',
    pathMatch: 'full'
  },
  /*{
    path: 'prepare',
    component: AccountPrepareComponent
  },*/
  {
    path: 'personal-info',
    component: AccountPersonalInfoComponent,
    //canActivate: [ProcessService],
  },
  {
    path: 'spouse-info',
    component: SpouseInfoComponent,
    //canActivate: [ProcessService],

  },
  {
    path: 'child-info',
    component: ChildInfoComponent,
    //canActivate: [ProcessService],

  },
  {
    path: 'contact-info',
    component: ContactInfoComponent,
    //canActivate: [ProcessService],
  },
  {
    path: 'review',
    component: AccountReviewComponent,
    //canActivate: [ProcessService],
  }, 
  {
    path: 'authorize',
    component: AuthorizeComponent,
    //canActivate: [ProcessService],
  },
  {
    path: 'sending',
    component: AccountSendingComponent,
    //canActivate: [ProcessService],
  },
  {
    path: 'confirmation',
    component: AccountConfirmationComponent,
    //canActivate: [],
  }
];

export const accountStepperPages = accountPages.filter(x => (x.path !== 'sending') && (x.path !== 'confirmation'));
