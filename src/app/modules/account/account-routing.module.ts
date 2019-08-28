import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { accountPages } from './account-page-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { AccountConfirmationComponent } from './pages/confirmation/confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: AccountContainerComponent,
    children: accountPages,
    canActivateChild: []
  },
  {
    path: 'home',
    component: HomeComponent,
    data: {title: 'Home'}
  },
  {
    path: 'confirmation',
    component: AccountConfirmationComponent,
    data: {title: 'Confirmation'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
