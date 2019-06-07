import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MspFullNameComponent } from './components/full-name/full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';

const componentList = [
  MspFullNameComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedCoreModule,
    FormsModule
  ],
  declarations: [
    componentList
  ],
  exports: [
    componentList,
    SharedCoreModule
  ]
})
export class MspCoreModule { }
