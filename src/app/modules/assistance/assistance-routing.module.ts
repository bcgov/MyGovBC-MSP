import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { assistPages } from './assist-page-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';
import { ROUTES_ASSIST } from './models/assist-route-constants';
import { AssistanceConfirmationComponent } from './pages/confirmation/confirmation.component';

const confirmationPage = ROUTES_ASSIST.CONFIRMATION.path + '/:status/:id';

const routes: Routes = [
  {
    path: '',
    component: AssistContainerComponent,
    children: assistPages
  },
  {
    path: confirmationPage,
    component: AssistanceConfirmationComponent,
    data: { title: ROUTES_ASSIST.CONFIRMATION.title }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistanceRoutingModule {}
