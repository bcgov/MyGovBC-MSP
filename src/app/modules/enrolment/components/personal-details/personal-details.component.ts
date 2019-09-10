import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { state, trigger, style } from '@angular/animations';
import {
  MspPerson,
  Gender
} from '../../../../components/msp/model/msp-person.model';
import { OutofBCRecord } from '../../../../models/outof-bc-record.model';
import {
  ActivitiesRules,
  StatusInCanada,
  Activities,
  DocumentRules,
  Relationship,
  LangStatus,
  LangActivities,
  yesNoLabels,
  genderLabels
} from '../../../msp-core/models/status-activities-documents';
import * as _ from 'lodash';


import { BaseComponent } from '../../../../models/base.component';
import {
  CANADA,
  Address,
  ProvinceList,
  BRITISH_COLUMBIA,
  CommonImage} from 'moh-common-lib';
import { MspAddressConstants } from '../../../../models/msp-address.constants';
import { MspDocumentConstants, Documents } from '../../../msp-core/models/msp-document.constants';
import { ServicesCardDisclaimerModalComponent } from '../../../msp-core/components/services-card-disclaimer/services-card-disclaimer.component';
@Component({
  selector: 'msp-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
/*
  animations: [
    trigger('shrinkOut', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('shrinkOutStatus', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('genderListSignal', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ]),

    trigger('institutionWorkSignal', [
      state('in', style({ display: 'none' })),
      state('out', style({ display: 'block' }))
      // transition('* => *', animate(500))
    ])
  ]
  */
})
export class PersonalDetailsComponent extends BaseComponent {
  /**
   * Constant values for this component
   * TODO: Determine if any of these constants are common to other components
   *
   * NOTE: Address information should be a separate component as its elements are repeated on this page
   */
  movedFromCountryLabel = 'Which country are you moving from?';
  movedFromProvinceLabel = [
   'Which province are you moving from?',
   'Which province are they moving from?',
   'Which province are they moving from?',
   'Which province are they moving from?'
  ];


  documentUploadLabel = [
    'Upload your documents',
    ' Upload your spouse\'s documents',
    'Upload your child\'s documents',
    '<\Upload your child\'s documents'
  ];



  //lang = require('./i18n'); //TODO: pull wording from file to use in html
/*
  @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;
  @ViewChild('imageErrorModal') imageErrorModal: MspImageErrorModalComponent;
  @ViewChild('outOfBCRecord') outOfBCRecord: MspOutofBCRecordComponent;
  @ViewChild('gender') gender: MspGenderComponent;
  @ViewChild('birthDate') birthdate: MspBirthDateComponent;
  @ViewChild('arrivalDateBC') arrivalDateBC: MspArrivalDateComponent;
  @ViewChild('arrivalDateCanada') arrivalDateCanada: MspArrivalDateComponent;
  @ViewChild('healthNumber') healthNumber: HealthNumberComponent;
  @ViewChild('armedForcedQuestion') armedForcedQuestion: HTMLElement;
  @ViewChild('dischargeDate') dischargeDate: MspDischargeDateComponent;
  @ViewChild('schoolQuestion') schoolQuestion: HTMLElement;
  @ViewChild('inBCAfterStudiesQuestion') inBCAfterStudiesQuestion: HTMLElement;
  @ViewChild('schoolAddress') schoolAddress: MspAddressComponent;
  @ViewChild('schoolDate') schoolDate: MspSchoolDateComponent;
  */
  @ViewChild('mspServicesCardModal')
  servicesCardDisclaimerModalComponent: ServicesCardDisclaimerModalComponent;

  @Input() person: MspPerson;
  @Output() personChange: EventEmitter<MspPerson> = new EventEmitter<MspPerson>();


  /*
  @Input() id: string;
  @Input() showError: boolean;
  @Output() notifyChildRemoval: EventEmitter<MspPerson> = new EventEmitter<
    MspPerson
  >();
  @Output() notifySpouseRemoval: EventEmitter<MspPerson> = new EventEmitter<
    MspPerson
  >();*/


  /*
  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  */

  institutionWorkSignal: string;
  showServicesCardModal: boolean = false;


  /** Hides the 'Clear Spouse/Child' button, and the <hr> at the end of the component. Useful in layouts where this form must be embedded in a larger form.. */
  //@Input() embedded: boolean = false;
  institutionList: string[] = ['Yes', 'No'];


  // START -- NEW CODE FOR PAGE
  @Input() sectionTitle: string = 'Status in Canada';
  @Input() sectionInstruct: string = 'Please provide your immigration status information. You will be required to upload documents to support your status in Canada.';
  @Input() statusLabel: string = 'Your immigration status in Canada';
  @Input() statusDocuments: CommonImage[] = [];
  @Input() nameDocuments: CommonImage[] = [];
  @Output() statusDocumentsChange: EventEmitter<CommonImage[]> = new EventEmitter<CommonImage[]>();
  @Output() nameDocumentsChange: EventEmitter<CommonImage[]> = new EventEmitter<CommonImage[]>();



  statusOpts: string[] = Object.keys(LangStatus).map( x  => LangStatus[x] );
  activitiesOpts: string[] = Object.keys(LangActivities).map( x  => LangActivities[x] );
  documentOpts: string[] = MspDocumentConstants.langDocument();
  yesNoRadioLabels = yesNoLabels;
  genderRedioLabels = genderLabels;

  statusDocumentType: string = null;
  hasStatusDocumentType: boolean = false;
  nameChangeDocumentType: string = null;
  hasNameChangeDocumentType: boolean = false;
  hasNameChange: boolean = undefined;

  uploadDocInstructions = 'Click add, or drag and drop file into this box';
  // END -- NEW CODE FOR PAGE

  constructor(private cd: ChangeDetectorRef) {
    super(cd);
  }


  /**
   * Gets status available to the current person
   */
  getStatusInCanada() {
    return this.person.status !== undefined ? this.statusOpts[this.person.status] : undefined;
  }

  setStatusInCanada($event) {
    const status = Object.keys(LangStatus).find( x => LangStatus[x] === $event );
    this.person.status = StatusInCanada[status];

    // initialize activity
    this.person.currentActivity = null;

    if (this.person.status !== StatusInCanada.CitizenAdult) {
      this.person.institutionWorkHistory = 'No';
    }
    this.showServicesCardModal = true;
    this.personChange.emit(this.person);
  }

  setActivity(value: Activities) {
    if (
      this.showServicesCardModal &&
      this.person.bcServiceCardShowStatus &&
      this.person.relationship !== Relationship.ChildUnder19
    ) {
      this.servicesCardDisclaimerModalComponent.showModal();
      this.showServicesCardModal = false;
    }

    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = '';
    this.personChange.emit(this.person);
  }

  get activitiesTable() {
    if (this.activities) {
      return this.activities.map(itm => {
        return {
          label: this.activitiesOpts[itm],
          value: itm
        };
      });
    }
  }

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(
      this.person.relationship,
      this.person.status
    );
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get documents(): Documents[] {
    return DocumentRules.availiableDocuments(
      this.person.status,
      this.person.currentActivity
    );
  }

  get documentList() {
    if (this.documents) {
      return this.documents.map(itm => this.documentOpts[itm] );
    }
  }

  addStatusBtnClick() {
    this.hasStatusDocumentType = this.statusDocumentType ? true : false;
    console.log('addStatusBtnClick: ', this.hasStatusDocumentType, this.statusDocumentType );
  }

  addNameBtnClick() {
    this.hasNameChangeDocumentType = this.nameChangeDocumentType ? true : false;
  }

  /** Removes all documents in the list */
  removeDocuments() {
    this.statusDocuments = [];
    this.hasStatusDocumentType = false;
    this.statusDocumentsChange.emit(this.statusDocuments);

    this.removeNameDocuments();
  }

  removeNameDocuments() {
    this.nameDocuments = [];
    this.hasNameChangeDocumentType = false;
    this.nameDocumentsChange.emit(this.nameDocuments);
  }


  // Statuses
  get isCanadianCitizen(): boolean {
    return this.person.status === StatusInCanada.CitizenAdult;
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get nameChgDocumentList() {
    return DocumentRules.nameChangeDocument().map( x => this.documentOpts[x] );
  }

  addDocument(evt: CommonImage) {
    this.person.documents.images = this.person.documents.images.concat(evt);
    this.personChange.emit(this.person);
  }

  deleteDocument(evt: Array<any>) {
    console.log('evt', evt);
    this.person.documents.images = evt;
    this.personChange.emit(this.person);
  }



  /*
  errorDocument(evt: MspImage) {
    this.imageErrorModal.imageWithError = evt;
    this.imageErrorModal.showFullSizeView();
    this.imageErrorModal.forceRender();
  }*/

  ngAfterContentInit() {
    super.ngAfterContentInit();

    this.cd.detectChanges();
    /**
     * Load an empty row to screen
     */
 /*   if (this.person.relationship === Relationship.Spouse) {
      window.scrollTo(0, this.el.nativeElement.offsetTop);
    }*/
  }

  get arrivalDateLabel(): string {
    if (this.person.currentActivity === Activities.LivingInBCWithoutMSP) {
      return 'Most recent move to B.C.';
    }
    return 'Arrival date in B.C.';
  }

  provinceUpdate(evt: string) {
    this.person.movedFromProvinceOrCountry = evt;
    this.personChange.emit(this.person);
  }

  get schoolInBC(): boolean {
    return (
      this.person.schoolAddress &&
      this.person.schoolAddress.province &&
      this.person.schoolAddress.province ===  BRITISH_COLUMBIA
    );
  }
  setFullTimeStudent(event: any) {
    this.person.fullTimeStudent = event;
    if (!this.person.fullTimeStudent) {
      this.person.inBCafterStudies = null;
    }
    this.personChange.emit(this.person);
    this.emitIsFormValid();
  }
  setStayInBCAfterStudy(event: boolean) {
    this.person.inBCafterStudies = event;
    this.personChange.emit(this.person);
    this.emitIsFormValid();
    this.emitIsFormValid();
  }

  schoolAddressUpdate() {
    this.personChange.emit(this.person);
  }

  setHasPreviousPhn(value: boolean) {
    this.person.hasPreviousBCPhn = value;
    this.personChange.emit(this.person);
    this.cd.detectChanges();
    this.emitIsFormValid();
  }
  updateSchoolExpectedCompletionDate(evt: any) {
    this.person.studiesFinishedDay = evt.day;
    this.person.studiesFinishedMonth = evt.month;
    this.person.studiesFinishedYear = evt.year;
    this.personChange.emit(this.person);
  }

  updateSchoolDepartureDate(evt: any) {
    this.person.studiesDepartureDay = evt.day;
    this.person.studiesDepartureMonth = evt.month;
    this.person.studiesDepartureYear = evt.year;
    this.personChange.emit(this.person);
  }
/*
  removeChild(): void {
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }
*/
  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  selectInstitution(evt: boolean) {
    if (!evt) this.person = this.clearHistory(this.person);
    const history = evt ? 'Yes' : 'No';
    this.person.institutionWorkHistory = history;
    this.cd.detectChanges();
    this.personChange.emit(this.person);
    this.emitIsFormValid();
  }

  clearHistory(person: MspPerson) {
    person.dischargeDay = null;
    person.dischargeMonth = null;
    person.dischargeYear = null;
    return person;
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out'
      ? (this.institutionWorkSignal = 'in')
      : (this.institutionWorkSignal = 'out');
  }

  /*get hasValidCurrentActivity(): boolean {
    const v = _.isNumber(this.person.currentActivity);
    return v;
  }*/

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }

  handleHealthNumberChange(evt: string) {
    this.person.healthNumberFromOtherProvince = evt;
    this.personChange.emit(this.person);
  }

  setBeenOutsideForOver30Days(out: boolean) {
    this.person.declarationForOutsideOver30Days = out;
    if (out) {
      this.person.outOfBCRecord = new OutofBCRecord();
    } else {
      this.person.outOfBCRecord = null;
    }
    this.cd.detectChanges();
    this.personChange.emit(this.person);
    this.emitIsFormValid();
  }

  handleDeleteOutofBCRecord() {
    this.person.outOfBCRecord = null;
    this.personChange.emit(this.person);
  }

  handleOutofBCRecordChange() {
    this.personChange.emit(this.person);
  }
  //If false, then we don't want users continuing to further application;
  checkEligibility(): boolean {
    return !this.person.ineligibleForMSP;
  }

  setMovedToBCPermanently(moved: boolean) {
    this.person.madePermanentMoveToBC = moved;
    this.personChange.emit(this.person);
    this.emitIsFormValid();
  }
  setLivedInBCSinceBirth(lived: boolean) {
    this.person.livedInBCSinceBirth = lived;
    this.personChange.emit(this.person);
    this.emitIsFormValid();
    this.cd.detectChanges();
  }

  /*
  viewIdReqModal(event: Documents) {
    this.idReqModal.showFullSizeView(event);
  }*/

  isValid(): boolean {
    // Some inputs can be determine via the form.isValid,
    // check these explicitly

    // Status
    if (this.person.currentActivity == null) {
      return false;
    }

    // moved to bc permanently
    if (this.person.madePermanentMoveToBC == null) {
      console.log('madePermanentMoveToBC invalid');
      return false;
    }

    // outside bc 30 days
    if (this.person.declarationForOutsideOver30Days == null) {
      console.log('declarationForOutsideOver30Days invalid');
      return false;
    }

    // previous PHN
    if (this.person.hasPreviousBCPhn == null) {
      console.log('hasPreviousBCPhn invalid');
      return false;
    }

    // armed forces
  /*  if (
      this.armedForcedQuestion != null &&
      this.person.institutionWorkHistory == null
    ) {
      console.log('institutionWorkHistory invalid');
      return false;
    }*/

    if (this.person.isArrivalToBcBeforeDob) {
      return false;
    }

    if (this.person.isArrivalToCanadaBeforeDob) {
      return false;
    }

    // school
   /* if (this.schoolQuestion != null && this.person.fullTimeStudent == null) {
      console.log('schoolQuestion invalid');
      return false;
    }*/
    if (this.person.fullTimeStudent && this.person.inBCafterStudies == null) {
      console.log('inBCafterStudies invalid');
      return false;
    }

    return true;
  }
  setGender(evt: Gender) {
    this.person.gender = evt;
    this.personChange.emit(this.person);
  }

  isCanada(addr: Address): boolean {
    return addr && CANADA === addr.country;
  }

  // Province list
  provList(exceptBC: boolean = false): ProvinceList[] {
    return MspAddressConstants.provList(exceptBC);
  }
}
