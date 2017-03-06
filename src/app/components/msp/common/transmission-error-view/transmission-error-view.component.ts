import {Component, Input} from '@angular/core';
require('./transmission-error-view.less');

@Component({
  selector: 'msp-transmission-error-view',
  templateUrl: './transmission-error-view.component.html'
})
export class TransmissionErrorView {

  @Input() rawError: any;
  private showMoreErrorDetails: boolean;

  constructor(){

  }
  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

}