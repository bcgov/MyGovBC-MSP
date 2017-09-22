
import {Component, Inject, ViewChild} from '@angular/core';
import { MspProgressBarItem } from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import ProcessService, {ProcessStep} from "../service/process.service";
import {MspAccount} from '../model/account.model';
import MspDataService from '../service/msp-data.service';

require('./account.component.less');

/**
 * Account for MSP
 */
@Component({
  templateUrl: './account.component.html'
})

export class AccountComponent  {

    lang = require('./i18n');

    @ViewChild('progressBar') progressBar: MspProgressBarComponent;


    get accountProgressBarList(): Array<MspProgressBarItem> {

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

    get account(): MspAccount {
        return ;
    }

    constructor (@Inject('appConstants') appConstants: any,
                 private processService: ProcessService ,private dataService: MspDataService) {

        appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    private initProcessService () {
        this.processService.init([
            new ProcessStep("/msp/account/prepare"),
            new ProcessStep("/msp/account/personal-info"),
            new ProcessStep("/msp/account/address"),
            new ProcessStep("/msp/account/review"),
            new ProcessStep("/msp/account/sending")]);
    }



}