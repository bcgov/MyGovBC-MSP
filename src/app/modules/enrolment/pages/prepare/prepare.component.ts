import {ChangeDetectorRef, Component, Injectable, ViewChild} from '@angular/core';
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

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends BaseComponent {

  @ViewChild('formRef') form: NgForm;
  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  private apt: MspPerson;
  mspApplication: MspApplication;

  // labels
  radioLabels = yesNoLabels;


  // Web links
  links = environment.links;

  // verbage
  question1 = 'Do you currently live in British Columbia (i.e. Do you have an address here)?';
  plannedAwayForOver30DaysQuestion = 'Will you or anyone included on this application be away from B.C. for more than 30 days in total over the next six months?';

  constructor(public dataService: MspDataService,
              private pageStateService: PageStateService,
              private _router: Router,
              cd: ChangeDetectorRef) {
      super(cd);
      this.mspApplication = this.dataService.mspApplication;
      this.apt = this.mspApplication.applicant;
  }

  ngOnInit(){
    this.pageStateService.setPageIncomplete(this._router.url, this.mspApplication.pageStatus);
  }

  ngAfterViewInit() {

    if (!this.mspApplication.infoCollectionAgreement) {
      this.mspConsentModal.showFullSizeView();
    }

    if (this.form) {
      this.form.valueChanges
      .subscribe(() => {
        this.dataService.saveMspApplication();
        this.emitIsFormValid();
      });
    }
  }

  goToPersonalInfo(){
    if (this.mspApplication.infoCollectionAgreement !== true){
      console.log('user agreement not accepted yet, show user dialog box.');
      this.mspConsentModal.showFullSizeView();
    } else {
      this.pageStateService.setPageComplete(this._router.url, this.mspApplication.pageStatus);
      this._router.navigate([ROUTES_ENROL.PERSONAL_INFO.fullpath]);
    }
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

  setLiveInBC(live: any) {
    console.log(live);

    this.dataService.mspApplication.applicant.liveInBC = live;
    this.apt.liveInBC = live;
    this.dataService.saveMspApplication();
  }

  setPlannedAbsence(live: any) {
    this.dataService.mspApplication.applicant.plannedAbsence = live;
    this.apt.plannedAbsence = live;
    this.dataService.saveMspApplication();
  }

  setUnusualCircumstance(live: any) {
    this.dataService.mspApplication.unUsualCircumstance = live;
    this.dataService.saveMspApplication();
  }

  get applicant(): MspPerson {
    return this.apt;
  }

  canContinue(): boolean {
    const app = this.dataService.mspApplication;
    return app.applicant.plannedAbsence === false
      && app.applicant.liveInBC === true
      && app.unUsualCircumstance === false;
  }
}
