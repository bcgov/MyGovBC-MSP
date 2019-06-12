import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccletContainerComponent } from './components/acclet-container/acclet-container.component';
import { accletPages } from './acclet-page-routing.module';

const routes: Routes = [
  {
    path: '',
    component: AccletContainerComponent,
    children: accletPages,
    canActivateChild: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountLetterRoutingModule { }
