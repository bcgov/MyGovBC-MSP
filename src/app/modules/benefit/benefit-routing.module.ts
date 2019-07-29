import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BenefitContainerComponent } from './components/benefit-container/benefit-container.component';
import { benefitPages } from './benefit-page-routing.modules';
import { EligibilityComponent } from './pages/eligibility/eligibility.component';
import { BenefitConfirmationComponent } from './pages/confirmation/confirmation.component';
import { ProcessService } from '../../services/process.service';

const routes: Routes = [
  {
    path: '',
    component: BenefitContainerComponent,
    children: benefitPages,
    canActivateChild: []
  },
  {
    path: 'eligibility',
    component: EligibilityComponent,
    data: {title: 'Eligibility'}
  },
  {
    path: 'confirmation',
    component: BenefitConfirmationComponent,
    data: {title: 'Confirmation'}
  },
  {
    path: '',
    canActivate: [],
    redirectTo: 'eligibility',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitRoutingModule { }
