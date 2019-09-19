import {Component, Injectable, ViewChild, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import {  Router } from '@angular/router';
import * as _ from 'lodash';
import {MspDataService} from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { environment } from '../../../../../environments/environment.prod';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { MspApplication } from '../../models/application.model';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  mspApplication: MspApplication;

  // Web links
  links = environment.links;

  subscriptions: Subscription[];

  constructor(private dataService: MspDataService,
              private pageStateService: PageStateService,
              protected router: Router) {
      super(router);
      this.mspApplication = this.dataService.mspApplication;
  }

  ngOnInit(){
    this.pageStateService.setPageIncomplete(this.router.url, this.mspApplication.pageStatus);
  }

  ngAfterViewInit() {

    if (!this.mspApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    if (this.form) {
      this.subscriptions = [
        this.form.valueChanges.pipe(
          debounceTime(100)
        ).subscribe(() => {
          this.dataService.saveMspApplication();
        })
        ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  get applicant(): MspPerson {
    return this.mspApplication.applicant;
  }

  get liveInBC() {
    return this.applicant.liveInBC;
  }

  set liveInBC(live: boolean) {
    this.applicant.liveInBC = live;
  }

  get plannedAbsence() {
    return this.applicant.plannedAbsence;
  }

  set plannedAbsence(live: boolean) {
    this.applicant.plannedAbsence = live;
  }

  get unUsualCircumstance() {
    return this.dataService.mspApplication.unUsualCircumstance;
  }

  set unUsualCircumstance(live: boolean) {
    this.dataService.mspApplication.unUsualCircumstance = live;
  }

  acceptAgreement($event) {
    this.dataService.mspApplication.infoCollectionAgreement = $event;
  }

  continue() {
    if (this.mspApplication.infoCollectionAgreement !== true){
      console.log('user agreement not accepted yet, show user dialog box.');
      this.mspConsentModal.showFullSizeView();
    } else {
      this.pageStateService.setPageComplete(this.router.url, this.mspApplication.pageStatus);
      this.navigate(ROUTES_ENROL.PERSONAL_INFO.fullpath);
    }
  }

  canContinue(): boolean {
    return this.form.valid && this.applicant.plannedAbsence === false &&
           this.applicant.liveInBC === true && this.unUsualCircumstance === false;
  }
}
