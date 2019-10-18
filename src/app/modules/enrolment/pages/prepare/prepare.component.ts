import {Component, Injectable, ViewChild, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { MspDataService } from '../../../../services/msp-data.service';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { MspConsentModalComponent } from '../../../msp-core/components/consent-modal/consent-modal.component';
import { PageStateService } from '../../../../services/page-state.service';
import { MspPerson } from '../../../../components/msp/model/msp-person.model';
import { EnrolForm } from '../../models/enrol-form';
import { EnrolDataService } from '../../services/enrol-data.service';

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends EnrolForm implements AfterViewInit {

  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  constructor( protected dataService: MspDataService, // TO REMOVE when enrolDataService is done
               protected enrolDataService: EnrolDataService,
               protected pageStateService: PageStateService,
               protected router: Router ) {
    super( dataService, enrolDataService, pageStateService, router );
  }

  ngAfterViewInit() {

    if (!this.mspApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }
    super.ngAfterViewInit();
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
    this.dataService.saveMspApplication();
    this.enrolDataService.saveApplication();
  }

  continue() {
    this._canContinue = super.canContinue() &&
                        this.applicant.plannedAbsence === false &&
                        this.applicant.liveInBC === true &&
                        this.unUsualCircumstance === false;

    this._nextUrl = ROUTES_ENROL.PERSONAL_INFO.fullpath;
    super.continue();
  }
}
