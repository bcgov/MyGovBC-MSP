import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountContainerComponent } from './components/account-container/account-container.component';
import { accountPages } from './account-page-routing.module';

const routes: Routes = [
  {
    path: '',
    component: AccountContainerComponent,
    children: accountPages,
    canActivateChild: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
