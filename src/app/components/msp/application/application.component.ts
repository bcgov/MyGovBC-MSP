import { Component, Inject } from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';

require('./application.component.less');

/**
 * Application for MSP
 */
@Component({
  templateUrl: './application.component.html'
})

export class ApplicationComponent {

  lang = require('./i18n');

  public applicationProgressBarList: Array<MspProgressBarItem> = [
      new MspProgressBarItem(this.lang("./en/index.js").progressStep1, "/msp/application/prepare"),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep2, "/msp/application/personal-info"),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep3, "/msp/application/address"),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep4, "/msp/application/review")
  ];

  constructor (@Inject('appConstants') appConstants: any) {
    appConstants.serviceName = this.lang('./en/index.js').serviceName;
  }
}