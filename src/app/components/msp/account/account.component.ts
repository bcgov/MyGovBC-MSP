import {Component, Inject, ViewChild} from '@angular/core';
import {MspProgressBarItem} from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from "../common/progressBar/progressBar.component";
import ProcessService, {ProcessStep,ProcessUrls} from "../service/process.service";
import {MspAccount} from '../model/account.model';
import {ProgressBarHelper} from './ProgressBarHelper';
import MspDataService from '../service/msp-data.service';

require('./account.component.less');

/**
 * Account for MSP
 */
@Component({
    templateUrl: './account.component.html'
})

export class AccountComponent {

    lang = require('./i18n');


    @ViewChild('progressBar') progressBar: MspProgressBarComponent;

    constructor(@Inject('appConstants') appConstants: any,
                private processService: ProcessService, private dataService: MspDataService) {

        appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    get accountProgressBarList(): Array<MspProgressBarItem> {

        if (this.processService.process == null ||
            this.processService.process.processSteps == null) {
            this.initProcessService();
        }

        if (!this.dataService.getMspProgressBar()) {
            this.generateProgressBarItems();
        }

        return this.dataService.getMspProgressBar();


    };

    get account(): MspAccount {
        return;
    }

    private generateProgressBarItems() {
        var newProgressBarItems: MspProgressBarItem[] = [];
        let customHeight: Object = {'height': '60px'};

        let widthMainMenu: Object = {};
        let widthPersonalInfo: Object = {};
        let widthDependents: Object = {};
        let widthDocumentUpload: Object = {};

        if (this.dataService.getMspAccount()) {
            const accountChangeOptions = this.dataService.getMspAccount().accountChangeOptions;
            const progressBarHelper: ProgressBarHelper = new ProgressBarHelper(this.dataService.getMspAccount().accountChangeOptions);

            customHeight = progressBarHelper.height;

            widthMainMenu = progressBarHelper.widthMainMenu;

            widthPersonalInfo = progressBarHelper.widthPersonalInfo;
            widthDependents = progressBarHelper.widthDependents;

            widthDocumentUpload = progressBarHelper.widthDocumentUpload;

            if (accountChangeOptions.hasAnyPISelected()) {
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.personalInfoLabel, ProcessUrls.ACCOUNT_PERSONAL_INFO_URL, customHeight,widthPersonalInfo));
            }

            if (accountChangeOptions.depdendentChange) {
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.dependentsLabel, ProcessUrls.ACCOUNT_DEPENDENTS_URL, customHeight,widthDependents));
            }


        }
        let progressBar: MspProgressBarItem[] = [
            new MspProgressBarItem(this.lang("./en/index.js").progressStepMainMenu, this.processService.process.processSteps[0].route, customHeight, widthMainMenu),
            new MspProgressBarItem(this.lang("./en/index.js").progressStepDocumentation, this.processService.process.processSteps[1].route, customHeight, widthDocumentUpload),
            new MspProgressBarItem(this.lang("./en/index.js").progressStepReview, this.processService.process.processSteps[2].route, customHeight),

        ];
        if (newProgressBarItems && newProgressBarItems.length > 0) {
            progressBar.splice(1, 0, ...newProgressBarItems);
        }
        this.dataService.seMspProgressBar(progressBar);
    }


    private initProcessService() {
        this.processService.init([
            new ProcessStep(ProcessUrls.ACCOUNT_PREPARE_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_REVIEW_URL),
            new ProcessStep(ProcessUrls.ACCOUNT_SENDING_URL)]);
    }


}