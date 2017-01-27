import { Component, Inject } from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';

require('./assistance.component.less');

/**
 * Application for Premium Assistance
 */
@Component({
  templateUrl: './assistance.component.html'
})
export class AssistanceComponent {
  lang = require('./i18n');

  public assistanceProgressBarList: Array<MspProgressBarItem> = [
    new MspProgressBarItem(this.lang("./en/index.js").progressStep1, "/msp/assistance/prepare"),
    new MspProgressBarItem(this.lang("./en/index.js").progressStep2, "/msp/assistance/personal-info"),
    new MspProgressBarItem(this.lang("./en/index.js").progressStep3, "/msp/assistance/retro"),
    new MspProgressBarItem(this.lang("./en/index.js").progressStep4, "/msp/assistance/review"),
    new MspProgressBarItem(this.lang("./en/index.js").progressStep5, "/msp/assistance/authorize-submit")
  ];

  constructor (@Inject('appConstants') appConstants: any) {
    appConstants.serviceName = this.lang('./en/index.js').serviceName;
  }
}