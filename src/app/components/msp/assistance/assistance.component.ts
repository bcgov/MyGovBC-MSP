import {Component, Inject, ViewChild} from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import ProcessService, {ProcessStep} from "../service/process.service";

require('./assistance.component.less');

/**
 * Application for Premium Assistance
 */
@Component({
  templateUrl: './assistance.component.html'
})
export class AssistanceComponent {
  lang = require('./i18n');

  @ViewChild('progressBar') progressBar: MspProgressBarComponent;

  get assistanceProgressBarList(): Array<MspProgressBarItem> {
    if (this.processService.process == null ||
      this.processService.process.processSteps == null) {
      this.initProcessService();
    }

    return [ new MspProgressBarItem(this.lang("./en/index.js").progressStep1, this.processService.process.processSteps[0].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep2, this.processService.process.processSteps[1].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep3, this.processService.process.processSteps[2].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep4, this.processService.process.processSteps[3].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep5, this.processService.process.processSteps[4].route)
    ];
  }

  constructor (@Inject('appConstants') appConstants: any,
               private processService: ProcessService) {
    appConstants.serviceName = this.lang('./en/index.js').serviceName;
    this.initProcessService();
  }

  private initProcessService () {
    this.processService.init([
      new ProcessStep("/msp/assistance/prepare"),
      new ProcessStep("/msp/assistance/personal-info"),
      new ProcessStep("/msp/assistance/retro"),
      new ProcessStep("/msp/assistance/review"),
      new ProcessStep("/msp/assistance/authorize-submit"),
      new ProcessStep("/msp/assistance/sending")]);
  }
}