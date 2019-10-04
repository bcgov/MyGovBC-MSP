import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequestLetterComponent } from './pages/request-letter/request-letter.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestAclRoutingModule { }
