import {ChangeDetectorRef, Component, Injectable, ViewChild, OnDestroy, OnInit, AfterViewInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import {  Router } from '@angular/router';
import * as _ from 'lodash';
import {MspDataService} from '../../../../services/msp-data.service';
import {BaseComponent} from '../../../../models/base.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { environment } from '../../../../../environments/environment.prod';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { MspApplication } from '../../models/application.model';
import { yesNoLabels } from '../../../msp-core/models/msp-constants';
import { AbstractForm } from 'moh-common-lib';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends AbstractForm implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  private apt: MspPerson;
  mspApplication: MspApplication;

  // labels
  radioLabels = yesNoLabels;


  // Web links
  links = environment.links;

  subscriptions: Subscription[];

  constructor(private dataService: MspDataService,
              private pageStateService: PageStateService,
              protected router: Router) {
      super(router);
      this.mspApplication = this.dataService.mspApplication;
      this.apt = this.mspApplication.applicant;
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
        this.form.valueChanges.subscribe(() => { this.dataService.saveMspApplication(); })
        ];
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach( itm => itm.unsubscribe() );
  }

  get applicant(): MspPerson {
    return this.apt;
  }

  get liveInBC() {

    return this.apt.liveInBC;
  }

  get plannedAbsence() {
    return this.apt.plannedAbsence;
  }

  get unUsualCircumstance() {
    return this.dataService.mspApplication.unUsualCircumstance;
  }

  acceptAgreement($event) {
    this.dataService.mspApplication.infoCollectionAgreement = $event;
  }

  setLiveInBC(live: any) {
    this.dataService.mspApplication.applicant.liveInBC = live;
    this.apt.liveInBC = live;
  }

  setPlannedAbsence(live: any) {
    this.dataService.mspApplication.applicant.plannedAbsence = live;
    this.apt.plannedAbsence = live;
  }

  setUnusualCircumstance(live: any) {
    this.dataService.mspApplication.unUsualCircumstance = live;
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
    const app = this.dataService.mspApplication;
    return this.form.valid && app.applicant.plannedAbsence === false &&
           app.applicant.liveInBC === true && app.unUsualCircumstance === false;
  }
}
