import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { assistPages } from './assist-page-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';
import { ROUTES_ASSIST } from './models/assist-route-constants';
import { ConfirmationComponent } from '../msp-core/confirmation/confirmation.component';
import { RouteGuardService } from 'moh-common-lib';

const routes: Routes = [
  {
    path: '',
    component: AssistContainerComponent,
    children: assistPages
  },
  {
    path: ROUTES_ASSIST.CONFIRMATION.path,
    component: ConfirmationComponent,
    data: { title: ROUTES_ASSIST.CONFIRMATION.title }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistanceRoutingModule {}
