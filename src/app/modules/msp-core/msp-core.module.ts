import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MspFullNameComponent } from './components/full-name/full-name.component';
import { SharedCoreModule } from 'moh-common-lib';
import { FormsModule } from '@angular/forms';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { CitizenStatusComponent } from './components/citizen-status/citizen-status.component';
import { ServicesCardDisclaimerModalComponent } from './components/services-card-disclaimer/services-card-disclaimer.component';
import { MspStatusInCanadaRadioComponent } from './components/status-in-canada-radio/status-in-canada-radio.component';
import { TextMaskModule } from 'angular2-text-mask';

const componentList = [
  MspFullNameComponent,
  PersonalDetailsComponent,
  CitizenStatusComponent,
  ServicesCardDisclaimerModalComponent,
  MspStatusInCanadaRadioComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedCoreModule,
    FormsModule,
    TextMaskModule
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
