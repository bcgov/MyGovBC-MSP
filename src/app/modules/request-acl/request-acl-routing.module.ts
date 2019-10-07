import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestLetterComponent } from './pages/request-letter/request-letter.component';
import { AclConfirmationComponent } from './pages/acl-confirmation/acl-confirmation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'request-acl',
    pathMatch: 'full'
  },
  {
    path: 'request-acl',
    component: RequestLetterComponent
  },
  {
    path: 'confirmation',
    component: AclConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestAclRoutingModule { }
