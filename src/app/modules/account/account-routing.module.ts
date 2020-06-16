import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { HomeComponent } from './pages/home/home.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';
import { ACCOUNT_PAGES } from './account.constants';
import { LoadPageGuardService } from 'moh-common-lib';
import { accountPageRoutes } from './account-pages.route';
import { AccountPersonalInfoComponent } from './pages/personal-info/personal-info.component';
import { AccountSendingComponent } from './pages/sending/sending.component';

export const routes: Routes = [
  {
    path: '',
    component: AccountContainerComponent,
    children: accountPageRoutes,
    canActivateChild: [LoadPageGuardService],
    data: { title: ACCOUNT_PAGES.HOME.title },
  },
  {
    path: ACCOUNT_PAGES.HOME.path,
    component: HomeComponent,
    data: { title: ACCOUNT_PAGES.HOME.title },
  },
  {
    path: ACCOUNT_PAGES.SENDING.path,
    component: AccountSendingComponent,
    data: { title: ACCOUNT_PAGES.SENDING.title },
  },
  {
    path: ACCOUNT_PAGES.CONFIRMATION.path,
    component: AccountConfirmationComponent,
    data: { title: ACCOUNT_PAGES.CONFIRMATION.title },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
