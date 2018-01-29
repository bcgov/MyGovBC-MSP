import {Component, Inject, ViewChild} from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
// import ProcessService, {ProcessStep} from "../service/process.service";
import {ProcessService, ProcessStep} from "../service/process.service";

import { environment } from '../../../../environments/environment';

import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { MspLogService } from '../service/log.service';

/**
 * Application for MSP
 */
@Component({
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})

export class ApplicationComponent  {

  lang = require('./i18n');

  @ViewChild('progressBar') progressBar: MspProgressBarComponent;
  routerSubscription: Subscription;

  get applicationProgressBarList(): Array<MspProgressBarItem> {
    if (this.processService.process == null ||
      this.processService.process.processSteps == null) {
      this.initProcessService();
    }

    return [
      new MspProgressBarItem(this.lang("./en/index.js").progressStep1, this.processService.process.processSteps[0].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep2, this.processService.process.processSteps[1].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep3, this.processService.process.processSteps[2].route),
      new MspProgressBarItem(this.lang("./en/index.js").progressStep4, this.processService.process.processSteps[3].route)
    ]
  };

  constructor (private processService: ProcessService,
              private logService: MspLogService,
              private router: Router) {
    environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
    this.initProcessService();
  }

  ngOnInit() {
    this.logService.log({
      name: "Application - Loaded Page",
      url: this.router.url
    },"Application - Load Page")

    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.logService.log({
          name: "Application - Loaded Page",
          url: this.router.url
        },"Application - Loaded Page")
      });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private initProcessService () {
    this.processService.init([
      new ProcessStep("/msp/application/prepare"),
      new ProcessStep("/msp/application/personal-info"),
      new ProcessStep("/msp/application/address"),
      new ProcessStep("/msp/application/review"),
      new ProcessStep("/msp/application/sending")]);
  }

}