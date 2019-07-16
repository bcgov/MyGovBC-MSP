import {ChangeDetectorRef, Component, Injectable, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import {  Router } from '@angular/router';
import {MspApplication, MspPerson} from '../../models/application.model';
import * as _ from 'lodash';
import {MspDataService} from '../../../../services/msp-data.service';
import {ConsentModalComponent} from 'moh-common-lib';
import {ProcessService} from '../../../../services/process.service';
import {BaseComponent} from '../../../../models/base.component';
import { CommonButtonGroupComponent } from '../../../msp-core/components/common-button-group/common-button-group.component';
import { ROUTES_ENROL } from '../../models/enrol-route-constants';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends BaseComponent {

  static ProcessStepNum = 0;
  @ViewChild('formRef') form: NgForm;
  @ViewChild('liveInBCBtn') liveInBCBtn: CommonButtonGroupComponent ;
  @ViewChild('mspConsentModal') mspConsentModal: ConsentModalComponent;

  private apt: MspPerson;
  mspApplication: MspApplication;
  public styleClass: string = 'control-label';

  // labels
  radioLabels = [{ 'label': 'No', 'value': false}, {'label': 'Yes', 'value': true} ];


  // Web links
  links = environment.links;

  // verbage
  question1 = 'Do you currently live in British Columbia (i.e. Do you have an address here)?';
  plannedAwayForOver30DaysQuestion = 'Will you or anyone in your immediate family (included on this application) be away from B.C. for more than 30 days in total over the next six months?';

  constructor(public dataService: MspDataService,
              private _processService: ProcessService,
              private _router: Router,
              cd: ChangeDetectorRef) {
      super(cd);
      this.mspApplication = this.dataService.getMspApplication();
      this.apt = this.mspApplication.applicant;
  }

  ngOnInit(){
    this.initProcessMembers(PrepareComponent.ProcessStepNum, this._processService);
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
     // this._processService.setStep(0, true);
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
    return this.dataService.getMspApplication().unUsualCircumstance;
  }

  setLiveInBC(live: any) {
    console.log(live);

    this.dataService.getMspApplication().applicant.liveInBC = live;
    this.apt.liveInBC = live;
    this.dataService.saveMspApplication();
  }

  setPlannedAbsence(live: any) {
    this.dataService.getMspApplication().applicant.plannedAbsence = live;
    this.apt.plannedAbsence = live;
    this.dataService.saveMspApplication();
  }

  setUnusualCircumstance(live: any) {
    this.dataService.getMspApplication().unUsualCircumstance = live;
    this.dataService.saveMspApplication();
  }

  get applicant(): MspPerson {
    return this.apt;
  }

  canContinue(): boolean {
    return this.isAllValid();
  }

  isValid(): boolean {
    const app = this.dataService.getMspApplication();
    return app.applicant.plannedAbsence === false
      && app.applicant.liveInBC === true
      && app.unUsualCircumstance === false;
  }
}
