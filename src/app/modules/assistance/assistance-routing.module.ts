import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { assistPages } from './assist-page-routing.module';
import { AssistContainerComponent } from './components/assist-container/assist-container.component';

const routes: Routes = [
  {
    path: '',
    component: AssistContainerComponent,
    children: assistPages,
    canActivateChild: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistanceRoutingModule { }
