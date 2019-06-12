import { Routes } from '@angular/router';
import { AccountLetterPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountLetterSendingComponent } from './pages/sending/sending.component';
import { AccountLetterConfirmationComponent } from './pages/confirmation/confirmation.component';

export const accletPages: Routes = [
  {
    path: '',
    canActivate: [],
    redirectTo: 'personal-info',
    pathMatch: 'full'
  },
  {
      path: 'personal-info',
      component: AccountLetterPersonalInfoComponent
  },
  {
      path: 'sending',
      component: AccountLetterSendingComponent,
     // canActivate: [ProcessService]
  },
  {
      path: 'confirmation',
      component: AccountLetterConfirmationComponent,
      canActivate: [],
  }
];
