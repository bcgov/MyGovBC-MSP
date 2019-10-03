import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './pages/landing/landing.component';
import { APP_ROUTES } from './models/route-constants';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    data: { breadcrumb: 'Home' }
  },
  {
    path: APP_ROUTES.ENROLMENT,
    loadChildren: 'app/modules/enrolment/enrolment.module#EnrolmentModule'
  },
  {
    path: APP_ROUTES.BENEFIT,
    loadChildren: 'app/modules/benefit/benefit.module#BenefitModule'
  },
  {
    path: APP_ROUTES.ASSISTANCE,
    loadChildren: 'app/modules/assistance/assistance.module#AssistanceModule'
  },
  {
    path: APP_ROUTES.ACCOUNT,
    loadChildren: 'app/modules/account/account.module#AccountModule'
  },
  {
    path: APP_ROUTES.ACCOUNT_LETTER,
    loadChildren: 'app/modules/account-letter/account-letter.module#AccountLetterModule'
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
