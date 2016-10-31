import {NgModule, Injectable} from '@angular/core';
import { RouterModule } from '@angular/router';

import {MspComponent} from './msp.component';



@Injectable()
@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'msp', component: MspComponent }      
    ])
  ],
  declarations: [
    MspComponent
  ],

  exports: [
    MspComponent
  ]
})
export class MspModule {

}