import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BenefitContainerComponent } from './components/benefit-container/benefit-container.component';
import { benefitPages } from './benefit-page-routing.modules';

const routes: Routes = [
  {
    path: '',
    component: BenefitContainerComponent,
    children: benefitPages,
    canActivateChild: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BenefitRoutingModule { }
