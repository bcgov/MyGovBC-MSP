import {Component, Input} from '@angular/core';

@Component({
  selector: 'msp-transmission-error-view',
  templateUrl: './transmission-error-view.component.html',
  styleUrls: ['./transmission-error-view.less']
})
export class TransmissionErrorView {

  @Input('rawError')
  rawError: any;
  public showMoreErrorDetails: boolean;

  toggleErrorDetails(){
    this.showMoreErrorDetails = !this.showMoreErrorDetails;
  }

}