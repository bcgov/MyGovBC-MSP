import { Component, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Application for Premium Assistance
 */
@Component({
  templateUrl: './assistance.component.html',
  styleUrls: ['./assistance.component.scss']
})
export class AssistanceComponent {
  lang = require('./i18n');

  // @ViewChild('progressBar') progressBar: MspProgressBarComponent;
  routerSubscription: Subscription;
  /*
  get assistanceProgressBarList(): Array<MspProgressBarItem> {
    if (this.processService.process == null ||
      this.processService.process.processSteps == null) {
      this.initProcessService();
    }
    */
  /*
    return [ new MspProgressBarItem(this.lang('./en/index.js').progressStep1, this.processService.process.processSteps[0].route),
      new MspProgressBarItem(this.lang('./en/index.js').progressStep2, this.processService.process.processSteps[1].route),
      new MspProgressBarItem(this.lang('./en/index.js').progressStep3, this.processService.process.processSteps[2].route),
      new MspProgressBarItem(this.lang('./en/index.js').progressStep4, this.processService.process.processSteps[3].route),
      new MspProgressBarItem(this.lang('./en/index.js').progressStep5, this.processService.process.processSteps[4].route)
    ];
  }

  */
  constructor(
    // private processService: ProcessService,
    private changeRef: ChangeDetectorRef,
    // private logService: MspLogService,
    private router: Router
  ) {
    // environment.appConstants.serviceName = this.lang('./en/index.js').serviceName;
    this.initProcessService();
  }

  ngOnInit() {
    /*this.logService.log({
      name: "Assistance - Loaded Page",
      url: this.router.url
    },"Assistance - Page Load")*/

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        // if (this.router.url.indexOf('/confirmation/') === -1) {
        //toned down logs.no log for confirmation page
        //     this.logService.log({
        //         name: 'PA - Loaded Page ',
        //         url: this.router.url
        //     }, 'PA - Loaded Page ');
        // }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription && !this.routerSubscription.closed) {
      this.routerSubscription.unsubscribe();
    }
  }

  private initProcessService() {
    //   this.processService.init([
    //     new ProcessStep('/msp/assistance/prepare'),
    //     new ProcessStep('/msp/assistance/personal-info'),
    //     new ProcessStep('/msp/assistance/retro'),
    //     new ProcessStep('/msp/assistance/review'),
    //     new ProcessStep('/msp/assistance/authorize-submit'),
    //     new ProcessStep('/msp/assistance/sending')]);
  }
}
