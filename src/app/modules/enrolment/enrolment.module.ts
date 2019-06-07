import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrolmentRoutingModule } from './enrolment-routing.module';
import { EnrolContainerComponent } from './components/enrol-container/enrol-container.component';
import { MspCoreModule } from '../msp-core/msp-core.module';

@NgModule({
  imports: [
    CommonModule,
    MspCoreModule,
    EnrolmentRoutingModule
  ],
  declarations: [EnrolContainerComponent]
})
export class EnrolmentModule { }
