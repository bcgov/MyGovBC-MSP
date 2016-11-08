import { Component } from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';

require('./application.component.less');

/**
 * Application for MSP
 */
@Component({
  templateUrl: './application.component.html'
})

export class ApplicationComponent {
    public applicationProgressBarList: Array<MspProgressBarItem> = [
        new MspProgressBarItem("Prepare", "/msp/application/prepare"),
        new MspProgressBarItem("Personal Info", "/msp/application/personal-info"),
        new MspProgressBarItem("Address", "/msp/application/address"),
        new MspProgressBarItem("Review & Submit", "/msp/application/review")
    ];
}