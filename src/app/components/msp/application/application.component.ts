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
        new MspProgressBarItem("1 Prepare", "/msp/application/prepare"),
        new MspProgressBarItem("2 Personal Info", "/msp/application/personal-info"),
        new MspProgressBarItem("3 Address", "/msp/application/address"),
        new MspProgressBarItem("4 Review & Submit", "/msp/application/review")
    ];
}