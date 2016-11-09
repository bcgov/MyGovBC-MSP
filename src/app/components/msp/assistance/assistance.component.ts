import { Component } from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';

require('./assistance.component.less');

/**
 * Application for Premium Assistance
 */
@Component({
  templateUrl: './assistance.component.html'
})
export class AssistanceComponent {
  public assistanceProgressBarList: Array<MspProgressBarItem> = [
    new MspProgressBarItem("Check Eligibility", "/msp/assistance/prepare"),
    new MspProgressBarItem("Personal & Contact Info", "/msp/application/personal-info"),
    new MspProgressBarItem("Review", "/msp/application/review"),
    new MspProgressBarItem("Authorize & Submit", "/msp/application/authorize-submit")
  ];
}