import { ContainerService, AbstractForm, PageStateService } from 'moh-common-lib';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {ProcessService} from '../../../services/process.service';

export class BaseForm extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  private _subscription: Subscription;
  private linkedProcessStepNumber: number;

  constructor( protected router: Router,
               protected containerService: ContainerService,
               protected pageStateService: PageStateService,
               protected _processService: ProcessService ) {
    super(router);
  }

  ngOnInit() {
    // Default behaviour for most pages - override if need different functionality
    this.containerService.setSubmitLabel();
    this.containerService.setUseDefaultColor();

    // Set page incomplete
    this.pageStateService.setPageIncomplete();
  }

  ngAfterViewInit() {
    this._subscription = this.containerService.$continueBtn.subscribe(
      (obs) => {
        this.continue();
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  isSet(val) {
    return val !== undefined && val !== null;
  }

  initProcessMembers(processStepNum: number, newProcessService: ProcessService){
    this.linkedProcessStepNumber = processStepNum;
    this._processService = newProcessService;
  }

  continue() {
    // console.log( 'Continue: base form to be overriden');
  }

  protected navigate( url: string ) {
    // Set page complete before navigating to next URL
    this.pageStateService.setPageComplete();
    super.navigate(url);
  }
}
