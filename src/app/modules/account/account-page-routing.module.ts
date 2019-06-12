import { Routes } from '@angular/router';
import { AccountPrepareComponent } from './pages/prepare/prepare.component';
import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountDependentChangeComponent } from './pages/dependent-change/dependent-change.component';
import { AccountDocumentsComponent } from './pages/documents/documents.component';
import { AccountReviewComponent } from './pages/review/review.component';
import { AccountSendingComponent } from './pages/sending/sending.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';

export const accountPages: Routes = [
{
  path: '',
  canActivate: [],
  redirectTo: 'prepare',
  pathMatch: 'full'
},
{
  path: 'prepare',
  component: AccountPrepareComponent
},
{
  path: 'personal-info',
  component: AccountPersonalInfoComponent,
  //canActivate: [ProcessService],
},
{
  path: 'dependent-change',
  component: AccountDependentChangeComponent,
  //canActivate: [ProcessService],

},
{
  path: 'documents',
  component: AccountDocumentsComponent,
  //canActivate: [ProcessService],
},
{
  path: 'review',
  component: AccountReviewComponent,
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
  canActivate: [],
}
];