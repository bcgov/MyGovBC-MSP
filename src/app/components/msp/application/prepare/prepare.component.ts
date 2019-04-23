import {ChangeDetectorRef, Component, Inject, Injectable, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MspApplication, Person} from '../../model/application.model';
import * as _ from 'lodash';
import { fromEvent} from 'rxjs/internal/observable/fromEvent';
import { merge} from 'rxjs/internal/observable/merge';
import { map} from 'rxjs/operators';
import {MspDataService} from '../../service/msp-data.service';
import {MspConsentModalComponent} from '../../common/consent-modal/consent-modal.component';
import {ProcessService} from '../../service/process.service';
import {BaseComponent} from '../../common/base.component';
import {CommonButtonGroupComponent} from "../../common/common-button-group/common-button-group.component";

@Component({
  templateUrl: './prepare.component.html'
})
@Injectable()
export class PrepareComponent extends BaseComponent {
  static ProcessStepNum = 0;
  lang = require('./i18n');
  @ViewChild('formRef') form: NgForm;
  @ViewChild('liveInBCBtn') liveInBCBtn: CommonButtonGroupComponent ;
 // @ViewChild('notLiveInBCBtn') notLiveInBCBtn: ElementRef;
//  @ViewChild('unUsualCircumstanceBtn') unUsualCircumstanceBtn: ElementRef;
//  @ViewChild('noUnusualCircustanceBtn') noUnusualCircustanceBtn: ElementRef;
//  @ViewChild('plannedAbsenceBtn') plannedAbsenceBtn: ElementRef;
//  @ViewChild('noPlannedAbsenceBtn') noPlannedAbsenceBtn: ElementRef;
  @ViewChild('mspConsentModal') mspConsentModal: MspConsentModalComponent;

  private apt: Person;
  mspApplication: MspApplication;

  constructor(private dataService: MspDataService,
    private _processService: ProcessService,
    private _router: Router,
    private cd: ChangeDetectorRef) {
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

    /*const liveInBC$ = fromEvent<MouseEvent>(this.liveInBCBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().applicant.liveInBC = true;
      }));
    const notLiveInBC$ = fromEvent<MouseEvent>(this.notLiveInBCBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().applicant.liveInBC = false;
      }));
     
    const unUsualCircumstance$ = fromEvent<MouseEvent>(this.unUsualCircumstanceBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().unUsualCircumstance = true;
      }));
    const noUnUsualCircumstance$ = fromEvent<MouseEvent>(this.noUnusualCircustanceBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().unUsualCircumstance = false;
      }));

    const plannedAbsenceBtn$ = fromEvent<MouseEvent>(this.plannedAbsenceBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().applicant.plannedAbsence = true;
      }));
    const noPlannedAbsenceBtn$ = fromEvent<MouseEvent>(this.noPlannedAbsenceBtn.nativeElement, 'click')
      .pipe(map( x => {
        this.dataService.getMspApplication().applicant.plannedAbsence = false;
      }));
 */
    if (this.form){
      merge(
        this.form.valueChanges,
       /* liveInBC$,
       // notLiveInBC$,
        unUsualCircumstance$,
        noUnUsualCircumstance$,
        plannedAbsenceBtn$,
        noPlannedAbsenceBtn$,*/
      )
      .subscribe(values => {
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
      this._processService.setStep(0, true);
      this._router.navigate(['/msp/application/personal-info']);
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

  setLiveInBC(live: boolean) {
    this.dataService.getMspApplication().applicant.liveInBC = live;
    this.apt.liveInBC = live;
    this.dataService.saveMspApplication();
  }

  setPlannedAbsence(live: boolean) {
    this.dataService.getMspApplication().applicant.plannedAbsence = live;
    this.apt.plannedAbsence = live;
    this.dataService.saveMspApplication();
  }

  setUnusualCircumstance(live: boolean) {
    this.dataService.getMspApplication().unUsualCircumstance = live;
    this.dataService.saveMspApplication();
  }

  get applicant(): Person {
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
