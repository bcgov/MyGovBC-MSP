import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrolContainerComponent } from './components/enrol-container/enrol-container.component';
import { enrolPages } from './enrol-page-routing.module';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { ROUTES_ENROL } from './models/enrol-route-constants';

const routes: Routes = [
  {
    path: '',
    component: EnrolContainerComponent,
    children: enrolPages,
    canActivateChild: []
  },
  {
    path: ROUTES_ENROL.CONFIRMATION.path,
    component: ConfirmationComponent,
    data: { title: ROUTES_ENROL.CONFIRMATION.title }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrolmentRoutingModule { }
