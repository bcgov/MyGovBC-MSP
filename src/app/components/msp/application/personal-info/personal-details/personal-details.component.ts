import  {
  Component, Input, Output, OnChanges, EventEmitter,
  SimpleChange, ViewChild, AfterViewInit, OnInit,
  state, trigger, style, ElementRef, QueryList, ViewChildren, ChangeDetectorRef
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Person } from '../../../model/person.model';
import { OutofBCRecord } from '../../../model/outof-bc-record.model';
import {
  StatusRules, ActivitiesRules, StatusInCanada, Activities,
  DocumentRules, Documents, Relationship
} from "../../../model/status-activities-documents";
import { MspImage } from '../../../model/msp-image';
import {Valid} from "../../../common/valid";
import * as _ from 'lodash';
import {MspIdReqModalComponent} from "../../../common/id-req-modal/id-req-modal.component";
import {MspImageErrorModalComponent} from "../../../common/image-error-modal/image-error-modal.component";
import {FileUploaderComponent} from "../../../common/file-uploader/file-uploader.component";
import {MspBirthDateComponent} from "../../../common/birthdate/birthdate.component";
import {MspNameComponent} from "../../../common/name/name.component";
import {MspArrivalDateComponent} from "../../../common/arrival-date/arrival-date.component";
import {MspOutofBCRecordComponent} from "../../../common/outof-bc/outof-bc.component";
import {ValidationStatus} from "../../../common/validation-status.interface";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Component({
    selector: 'msp-personal-details',
    templateUrl: './personal-details.component.html',

    animations: [
      trigger('shrinkOut', [
        state('in', style({ display: 'none'})),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),

      trigger('shrinkOutStatus', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),

      trigger('genderListSignal', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ]),
      
      trigger('institutionWorkSignal', [
        state('in', style({ display: 'none' })),
        state('out', style({ display: 'block'}))
        // transition('* => *', animate(500))
      ])
    ]
    
  }
)

export class PersonalDetailsComponent implements OnInit, AfterViewInit {
  lang = require('./i18n');
  langStatus = require('../../../common/status/i18n');
  langActivities = require('../../../common/activities/i18n');
  langDocuments = require('../../../common/documents/i18n');

  // Expose some types to template
  Activities: typeof Activities = Activities;
  Relationship: typeof Relationship = Relationship;
  StatusInCanada: typeof StatusInCanada = StatusInCanada;

  @ViewChild('formRef') form: NgForm;
  @ViewChild('fileUploader') fileUploader: FileUploaderComponent;
  @ViewChild('idReqModal') idReqModal: MspIdReqModalComponent;
  @ViewChild('imageErrorModal') imageErrorModal: MspImageErrorModalComponent;

  private birthDateComponentList:MspBirthDateComponent[] = [];
  private outofBCComponentList: MspOutofBCRecordComponent[] = [];
  private arrivalDateComponentList:MspArrivalDateComponent[] = [];

  private nameComponentsList: MspNameComponent[] = [];
  // @ViewChildren(MspNameComponent) nameComponents: QueryList<MspNameComponent>;
  
  @Input() viewOnly: boolean = false;
  @Input() person: Person;
  @Input() id: string;
  @Input() showError: boolean;
  @Output() notifyChildRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() notifySpouseRemoval: EventEmitter<Person> = new EventEmitter<Person>();
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() registerPersonalDetailsComponent = new EventEmitter<PersonalDetailsComponent>();

  shrinkOut: string;
  shrinkOutStatus: string;
  genderListSignal: string;
  institutionWorkSignal: string;

  validitySubscription:Subscription;

  // outofBCObservable:Observable<boolean>;

  outofBCFormValid:boolean = true;

  //This is the combined valiation status except for the outof bc form
  combinedValidationStatus:boolean = true;

  constructor(private el:ElementRef,
    private cd: ChangeDetectorRef){

  }

  statusLabel(): string {
    return this.lang('./en/index.js').statusLabel[this.person.relationship]
  }

  genders: string[] = ['Male', 'Female'];
  institutionList: string[] = ['Yes', 'No'];

  
  /**
   * Gets status available to the current person
   */
  get statusInCanada(): StatusInCanada[] {
    return StatusRules.availableStatus(this.person.relationship);
  }

  setStatus(value:StatusInCanada, p: Person) {
    p.status = value;
    p.currentActivity = null;

    if(p.status !== StatusInCanada.CitizenAdult){
      p.institutionWorkHistory = 'No';
    }
    this.onChange.emit(value);
  }

  setActivity(value:Activities) {
    this.person.currentActivity = value;
    this.person.movedFromProvinceOrCountry = undefined;
    this.onChange.emit(value);
  }

  /**
   * Gets the available activities given the known status
   */
  get activities(): Activities[] {
    return ActivitiesRules.availableActivities(this.person.relationship, this.person.status);
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get documents(): Documents[] {
    return DocumentRules.availiableDocuments(this.person.status, this.person.currentActivity);
  }

  /**
   * Gets the available documents given the known status and activity
   */
  get nameChangeDocuments(): Documents[] {
    return DocumentRules.nameChangeDocument();
  }

  addDocument(evt:MspImage){
    // console.log('image added: %s', evt);
    this.person.documents.images = this.person.documents.images.concat(evt);
    this.fileUploader.forceRender();
    this.onChange.emit(evt);
  }

  deleteDocument(evt:MspImage){
    this.person.documents.images = this.person.documents.images.filter( 
      (mspImage:MspImage) => {
        return evt.uuid !== mspImage.uuid;
      }
    );
    this.onChange.emit(evt);
  }

  errorDocument(evt:MspImage) {
    this.imageErrorModal.imageWithError = evt;
    this.imageErrorModal.showFullSizeView();
    this.imageErrorModal.forceRender();
  }

  ngOnInit(){
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(
      (values) => {
        this.onChange.emit(values);
      }
    );
    /**
     * Register this component with its parent.
     */
    this.registerPersonalDetailsComponent.emit(this);
    
    this.updateSubscription();
    
    /**
     * Load an empty row to screen 
     */
    if(this.person.relationship === Relationship.Spouse){
      window.scrollTo(0,this.el.nativeElement.offsetTop);
    }
  }

  /**
   * Each component provides this function to combine all observables from 
   * children and itself into one stream and calcuate one final boolean value to indicate if
   * all children and this component are valid.
   * 
   * User can only continue when the final boolean value is true.
   */
  updateSubscription(){
    // if(this.validitySubscription){
    //   this.validitySubscription.unsubscribe();
    // }
    
    let totalObvs:Observable<ValidationStatus>[] = new Array<Observable<ValidationStatus>>();

    let currentFormObservable:Observable<ValidationStatus> =
      this.form.valueChanges.map( values => {
        return {name: 'current personal details form', value: this.form.valid};
      });

    let birthDateObvs:Observable<ValidationStatus>[] = this.birthDateComponentList.map( bcom => {
      return bcom.isFormValid;
    });

    let arrivalDateObvs:Observable<ValidationStatus>[] = this.arrivalDateComponentList.map( bcom => {
      return bcom.isFormValid;
    })
    
    let nameComponentObvs:Observable<ValidationStatus>[] = 
    this.nameComponentsList.map ( nameComponent => {
      return nameComponent.isFormValid;
    });

    let outofBCObvs:Observable<ValidationStatus>[] = this.outofBCComponentList.map(
      component => {
        return component.isFormValid;
      }
    );

    let _outofBCObv:Observable<ValidationStatus> = Observable.create(
      (observer:Observer<ValidationStatus>) => {

        if(this.outofBCComponentList && this.outofBCComponentList.length > 0){
          this.outofBCComponentList[0].isFormValid.subscribe(
            (vstatus: ValidationStatus)=> {
              observer.next(vstatus);
            }
          )
        }
      }
    );
    /**
     * We need this code block to ensure that the validatin status from 
     * the outof-bc componnet can always get rolled up with the rest of the form
     * after togging yes/no on the question.
     * 
     * This is to get around the following bug.
     * 
     * This is likely a bug either in Angular 2 or RxJS:
     * After using the yes/no toggle to add/remove outof-bc component, the 
     * combineLatest is not picking up values from the isFormValid observable.
     */
    if(this.outofBCComponentList.length){
      // console.log('add outofbc component to list of observables!');
      let outofBCObservable = this.outofBCComponentList[0].isFormValid;

      outofBCObservable.subscribe( (status:ValidationStatus) => {
        // console.log('a separate subscription from pesonal details: %s - %s', status.name, status.value);
        if(this.person.declarationForOutsideOver30Days === true){
          this.outofBCFormValid = status.value;
        }else{
          this.outofBCFormValid = true;
        }

        this.isFormValid.emit(this.combinedValidationStatus && this.outofBCFormValid); 
      })
    }

    Observable.combineLatest(
        currentFormObservable,
        ...birthDateObvs,
        ...arrivalDateObvs,
        ...nameComponentObvs
      ).subscribe((collection:ValidationStatus[]) => {

      let combinedValidationState = collection.reduce( (acc: ValidationStatus, cur: ValidationStatus, idx:number, arr: ValidationStatus[]) => {
        // console.log('processing index: %d', idx);
        // console.log('observables values array: %o', arr);
        return {name: 'combined status at personl details level', value: acc.value && cur.value};
      },{name: 'starter', value: true});

      // console.log('combinedValidationState at personal details value: %s', combinedValidationState.value);

      this.combinedValidationStatus = combinedValidationState.value;
      this.isFormValid.emit(this.combinedValidationStatus && this.outofBCFormValid); 
    });

  }

  collectObservabls(destObvs:Observable<ValidationStatus>[], targetAbvs:Observable<ValidationStatus>[]): Observable<ValidationStatus>[]{
    if(targetAbvs.length > 0){
      return destObvs.concat(targetAbvs);
    }else{
      return destObvs
    }
  }

  ngOnDestroy(){
    if(this.validitySubscription){
      this.validitySubscription.unsubscribe();
      this.validitySubscription = null;    
    }    
  }

  onRegisterOutOfBCComponent(comp:MspOutofBCRecordComponent){
    console.log('outofbc component register with parent personal details');
    this.outofBCComponentList = this.outofBCComponentList.concat(comp);
    this.updateSubscription();
  }

  onUnregisterOutOfBCComponent(comp:MspOutofBCRecordComponent){
    console.log('outofbc component unregister with parent personal details');
    this.outofBCComponentList = [];
    this.updateSubscription();
  }

  onRegisterBirthDateComponent(comp:MspBirthDateComponent){
    this.birthDateComponentList.push(comp);
    this.updateSubscription();
  }
  onRegisterArrivalDateComponent(comp:MspArrivalDateComponent){
    this.arrivalDateComponentList.push(comp);
    this.updateSubscription();
  }

  onRegisterMspNameComponent(comp:MspNameComponent){
    this.nameComponentsList.push(comp);
    this.updateSubscription();

    // comp.isFormValid.subscribe( (value:ValidationStatus) => {
    //   console.log('a sepearate subscription for name component only: %o', value);
    // });
  }

  get arrivalDateLabel():string {
    if (this.person.currentActivity == Activities.LivingInBCWithoutMSP) {
      return this.lang('./en/index.js').arrivalDateToBCLabelForReturning;
    }
    return this.lang('./en/index.js').arrivalDateToBCLabel;
  }

  provinceUpdate(evt:string){
    this.person.movedFromProvinceOrCountry = evt;
    this.onChange.emit(evt);
  }

  get schoolInBC():boolean {
    return this.person.schoolAddress
      && this.person.schoolAddress.province 
      && this.person.schoolAddress.province.toLowerCase() === 'british columbia';
  }
  setFullTimeStudent(event: boolean) {
    this.person.fullTimeStudent = event;
    if (!this.person.fullTimeStudent) {
      this.person.inBCafterStudies = null;
    }
    this.onChange.emit(event);
  }

  schoolAddressUpdate(evt:any){
    this.onChange.emit(evt);
  }

  updateSchoolExpectedCompletionDate(evt:any){
    // console.log('school expected completion date updated: %o', evt);
    this.person.studiesFinishedDay = evt.day;
    this.person.studiesFinishedMonth = evt.month;
    this.person.studiesFinishedYear = evt.year;
    this.onChange.emit(evt);
  }

  updateSchoolDepartureDate(evt:any){
    // console.log('school departure date updated: %o', evt);
    this.person.studiesDepartureDay = evt.day;
    this.person.studiesDepartureMonth = evt.month;
    this.person.studiesDepartureYear = evt.year;
    this.onChange.emit(evt);
  }  

  removeChild(): void {
    this.notifyChildRemoval.emit(this.person);
    // this.notifyChildRemoval.next(id);
  }

  removeSpouse(): void {
    this.notifySpouseRemoval.emit(this.person);
  }

  get institutionWorkHistory(): string {
    return this.person.institutionWorkHistory;
  }

  selectInstitution(history: string) {
    this.person.institutionWorkHistory = history;
    if (history == 'No') {
      this.person.dischargeDay = null;
      this.person.dischargeMonth = null;
      this.person.dischargeYear = null;
    }

    this.onChange.emit(history);
  }

  toggleInstituationList() {
    this.institutionWorkSignal === 'out' ? this.institutionWorkSignal = 'in' : this.institutionWorkSignal = 'out';    
  }

  get hasValidCurrentActivity(): boolean{
    let v = _.isNumber(this.person.currentActivity);
    return v;
  }

  get isInstitutionListShown() {
    return this.institutionWorkSignal === 'out';
  }

  handleHealthNumberChange(evt:string){
    this.person.healthNumberFromOtherProvince = evt;
    this.onChange.emit(evt);
    
  }

  setBeenOutsideForOver30Days(out:boolean){
    this.person.declarationForOutsideOver30Days = out;
    if(out){
      this.person.outOfBCRecord = new OutofBCRecord();
    }else {
      this.person.outOfBCRecord = null;
      this.outofBCComponentList = [];
    }
    
    this.onChange.emit(out);
  }

  handleDeleteOutofBCRecord(evt:OutofBCRecord){
    this.person.outOfBCRecord = null;
    this.onChange.emit(evt);
  }

  handleOutofBCRecordChange(evt:OutofBCRecord){
    this.onChange.emit(evt);
  }

  get outofBCRecordsValid():boolean {
    let valid = true;
    this.person.outOfBCRecord.isValid();

    return valid;
  }

  setMovedToBCPermanently(moved:boolean){
    this.person.madePermanentMoveToBC = moved;
    this.onChange.emit(moved);
  }
  setLivedInBCSinceBirth(lived:boolean){
    this.person.livedInBCSinceBirth = lived;
    this.onChange.emit(lived);
  }

  viewIdReqModal(event:Documents) {
    this.idReqModal.showFullSizeView(event);
  }
}
