import {Component, Inject, ViewChild} from '@angular/core';
import {ProcessService, ProcessStep} from '../../../services/process.service';
import {environment} from '../../../../environments/environment';
import {Router, NavigationEnd} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MspLogService} from '../../../services/log.service';

/**
 * Application for MSP
 */
@Component({
    templateUrl: './account-letter.component.html',
    styleUrls: ['./account-letter.component.scss']
})

export class AccountLetterComponent {

    lang = require('./i18n');

    routerSubscription: Subscription;

    constructor(private processService: ProcessService,
                private logService: MspLogService,
                private router: Router) {
        environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
        this.initProcessService();
    }

    ngOnInit() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(event => {
              /*
               Fixed the bug: After a successful submission , when user press back button no process service exists ,so it throws NPE
                This wont create overhead since it creates only if process service is empty
                */
                this.initProcessService();
            });
    }

    ngOnDestroy() {
        if (this.routerSubscription && !this.routerSubscription.closed) {
            this.routerSubscription.unsubscribe();
        }
    }

    private initProcessService() {
        if (this.processService.process === null) {
            this.processService.init([
                new ProcessStep('/msp/account-letter/personal-info'),
                new ProcessStep('/msp/account-letter/sending')]);
        }
    }
}
