import {Component, Input} from '@angular/core';
import './transmission-error-view.less';

@Component({
  selector: 'msp-transmission-error-view',
  templateUrl: './transmission-error-view.component.html'
})
export class TransmissionErrorView {

  @Input('rawError')
  rawError: any;
  
  private showMoreErrorDetails: boolean;

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

}