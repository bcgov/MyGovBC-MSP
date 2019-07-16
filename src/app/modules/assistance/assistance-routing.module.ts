import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { assistPages } from './assist-page-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';
import { AssistGuard } from './guards/assist.guard';
import { AssistanceConfirmationComponent } from './pages/confirmation/confirmation.component';

const routes: Routes = [
  {
    path: '',
    component: AssistContainerComponent,
    children: [
      ...assistPages,
      {
        path: 'confirmation/:status/:id',
        component: AssistanceConfirmationComponent,

        canActivate: [AssistGuard]
      }
    ],
    canActivateChild: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistanceRoutingModule {}
