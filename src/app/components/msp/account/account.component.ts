import {Component, Inject, ViewChild} from '@angular/core';
import {MspProgressBarItem} from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from '../common/progressBar/progressBar.component';
import {ProcessService, ProcessStep, ProcessUrls} from '../service/process.service';
import {MspAccountApp} from '../model/account.model';
import {ProgressBarHelper} from './ProgressBarHelper';
import {MspDataService} from '../service/msp-data.service';
import {environment} from '../../../../environments/environment';
import {Router, NavigationEnd} from '@angular/router';
import { filter } from 'rxjs/operators';
import {MspLogService} from '../service/log.service';
import {Subscription} from 'rxjs/internal/Subscription';


require('./account.component.scss');

/**
 * AccountComponent for MSP, this houses everything that happens under the
 * Account Change section..  This component contains the ProgressBar and the
 * RouterOutlet, and through the Router it contains every account page.
 */
@Component({
    templateUrl: './account.component.html'
})
export class AccountComponent {
    lang = require('./i18n');
    @ViewChild('progressBar') progressBar: MspProgressBarComponent;
    routerSubscription: Subscription;


    constructor(private processService: ProcessService,
                private dataService: MspDataService,
                private router: Router,
                private logService: MspLogService) {
        environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    ngOnInit() {

        /*  this.logService.log({
              name: "Account - Loaded Page",
              url: this.router.url
          },"Account -Page Load")
        */
        this.routerSubscription = this.router.events
          .pipe(filter(event => event instanceof NavigationEnd))
          .subscribe(event => {
                if (this.router.url.indexOf('/confirmation/') === -1) {//toned down logs.no log for confirmation page
                    this.logService.log({
                        name: 'Account - Loaded Page ',
                        url: this.router.url
                    }, 'Account - Loaded Page ');
                }
            });
    }

    ngOnDestroy() {
        if (this.routerSubscription && !this.routerSubscription.closed) {
            this.routerSubscription.unsubscribe();
        }
        /*this.routerSubscription.unsubscribe();*/
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
    }


    private generateProgressBarItems() {
        const newProgressBarItems: MspProgressBarItem[] = [];

        let widthMainMenu: Object = {};
        let widthPersonalInfo: Object = {};
        let widthDependents: Object = {};
        let widthDocumentUpload: Object = {};
        let widthReview: Object = {};

        if (this.dataService.getMspAccountApp()) {
            const accountChangeOptions = this.dataService.getMspAccountApp().accountChangeOptions;

            const progressBarHelper: ProgressBarHelper = new ProgressBarHelper(this.dataService.getMspAccountApp().accountChangeOptions);

            widthMainMenu = progressBarHelper.widthMainMenu;
            widthPersonalInfo = progressBarHelper.widthPersonalInfo;
            widthDependents = progressBarHelper.widthDependents;
            widthDocumentUpload = progressBarHelper.widthDocumentUpload;
            widthReview = progressBarHelper.widthWidthReview;

            if (accountChangeOptions.hasAnyPISelected()) {
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.personalInfoLabel, ProcessUrls.ACCOUNT_PERSONAL_INFO_URL, widthPersonalInfo));
            }

            if (accountChangeOptions.dependentChange) {
                newProgressBarItems.push(new MspProgressBarItem(progressBarHelper.dependentsLabel, ProcessUrls.ACCOUNT_DEPENDENTS_URL, widthDependents));
            }

        }


        const progressBar: MspProgressBarItem[] = [
            new MspProgressBarItem(this.lang('./en/index.js').progressStepMainMenu, this.processService.process.processSteps[0].route, widthMainMenu),
            new MspProgressBarItem(this.lang('./en/index.js').progressStepDocumentation, ProcessUrls.ACCOUNT_FILE_UPLOADER_URL, widthDocumentUpload),
            new MspProgressBarItem(this.lang('./en/index.js').progressStepReview, ProcessUrls.ACCOUNT_REVIEW_URL, widthReview),
        ];


        if (newProgressBarItems && newProgressBarItems.length > 0) {
            progressBar.splice(1, 0, ...newProgressBarItems);
        }

        this.dataService.seMspProgressBar(progressBar);
    }


    /**
     * Sets ProcessService to the static incomplete state ready to be configured
     * by AccountPrepareComponent as long as ProcessService has not already been
     * configured by AccountPrepareComponent.  The static incomplete state does
     * NOT include the dynamic options, like AccountDependentChangeComponent,
     * which the user selects at runtime via AccountPrepareComponent.
     *
     * ProcessService is stored in LocalStorage and persists through refreshes.
     *
     */
    private initProcessService() {

        // Ensure that ProcessService isn't already configured for Account
        if (this.processService.process === null
            || this.processService.getStepNumber(ProcessUrls.ACCOUNT_PREPARE_URL) == -1) {

            this.processService.init([
                new ProcessStep(ProcessUrls.ACCOUNT_PREPARE_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_FILE_UPLOADER_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_REVIEW_URL),
                new ProcessStep(ProcessUrls.ACCOUNT_SENDING_URL)
            ]);
        }
    }


}
