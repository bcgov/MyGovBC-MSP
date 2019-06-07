import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrolContainerComponent } from './components/enrol-container/enrol-container.component';
import { enrolPages } from './enrol-page-routing.module';

const routes: Routes = [
  {
    path: '',
    component: EnrolContainerComponent,
    children: enrolPages,
    canActivateChild: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrolmentRoutingModule { }
