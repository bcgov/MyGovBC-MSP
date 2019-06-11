import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing/landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'enrolment',
    loadChildren: 'app/modules/enrolment/enrolment.module#EnrolmentModule'
  },
  {
    path: 'benefit',
    loadChildren: 'app/modules/benefit/benefit.module#BenefitModule'
  },
  {
    path: 'assistance',
    loadChildren: 'app/modules/assistance/assistance.module#AssistanceModule'
  },
  {
    path: 'account',
    loadChildren: 'app/modules/account/account.module#AccountModule'
  },
  {
    path: 'old-msp',
    loadChildren: 'app/components/msp/msp.module#MspModule'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
