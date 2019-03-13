import {Component, Inject, ViewChild, ChangeDetectorRef} from '@angular/core';
import {MspProgressBarItem} from '../common/progressBar/progressBarDataItem.model';
import {MspProgressBarComponent} from '../common/progressBar/progressBar.component';
import {ProcessService, ProcessStep} from '../service/process.service';
import {environment} from '../../../../environments/environment';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MspLogService} from '../service/log.service';

@Component({
    selector: 'msp-benefit',
    templateUrl: './benefit.component.html',
    styleUrls: ['./benefit.component.scss']
})
export class BenefitComponent {

    lang = require('./i18n');

    @ViewChild('progressBar') progressBar: MspProgressBarComponent;
    routerSubscription: Subscription;

    constructor(private processService: ProcessService,
                private changeRef: ChangeDetectorRef,
                private logService: MspLogService,
                private router: Router) {
        environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    get benefitProgressBarList(): Array<MspProgressBarItem> {
        if (this.processService.process == null ||
            this.processService.process.processSteps == null) {
            this.initProcessService();
        }

        return [new MspProgressBarItem(this.lang('./en/index.js').progressStep1, this.processService.process.processSteps[0].route),
            new MspProgressBarItem(this.lang('./en/index.js').progressStep2, this.processService.process.processSteps[1].route),
            new MspProgressBarItem(this.lang('./en/index.js').progressStep3, this.processService.process.processSteps[2].route),
            new MspProgressBarItem(this.lang('./en/index.js').progressStep4, this.processService.process.processSteps[3].route),
            new MspProgressBarItem(this.lang('./en/index.js').progressStep5, this.processService.process.processSteps[4].route)
        ];
    }

    ngOnInit() {
        //TODO make logs working
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
                if (this.router.url.indexOf('/confirmation/') === -1) {//toned down logs.no log for confirmation page
                    this.logService.log({
                        name: 'Supplementary Benefit - Loaded Page ',
                        url: this.router.url
                    }, 'PA - Loaded Page ');
                }
            });
    }

    ngOnDestroy() {
        if (this.routerSubscription && !this.routerSubscription.closed) {
            this.routerSubscription.unsubscribe();
        }
    }

    private initProcessService() {
        this.processService.init([
            new ProcessStep('/msp/benefit/prepare'),
            new ProcessStep('/msp/benefit/personal-info'),
            new ProcessStep('/msp/benefit/documents'),
            new ProcessStep('/msp/benefit/review'),
            new ProcessStep('/msp/benefit/authorize-submit'),
            new ProcessStep('/msp/benefit/sending')]);
    }

}
