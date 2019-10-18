import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestLetterComponent } from './pages/request-letter/request-letter.component';
import { AclConfirmationComponent } from './pages/acl-confirmation/acl-confirmation.component';
import { ROUTES_ACL } from './request-acl-route-constants';

const routes: Routes = [
  {
    path: '',
    redirectTo: ROUTES_ACL.REQUEST_ACL.path,
    pathMatch: 'full'
  },
  {
    path: ROUTES_ACL.REQUEST_ACL.path,
    component: RequestLetterComponent
  },
  {
    path: ROUTES_ACL.CONFIRMATION.path,
    component: AclConfirmationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestAclRoutingModule { }
