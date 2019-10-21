import {IPerson} from './msp-person.interface';


//import { StatusInCanada, Documents, CancellationReasons} from '../../../models/msp-core/models/canadian-status.enum';
import {OutofBCRecord} from '../../../models/outof-bc-record.model';
import * as moment from 'moment';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';
import {PhoneNumber} from './phone.model';
//import { MspImage } from '../../../../../models/msp-image';
import { PersonStatusChange } from './person-status-change';


import { SimpleDate, Address, BRITISH_COLUMBIA, CANADA, CommonImage } from 'moh-common-lib';
import { CanadianStatusReason, StatusInCanada } from '../../../modules/msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { CancellationReasons } from 'app/models/status-activities-documents';
import { SupportDocuments } from '../../../modules/msp-core/models/support-documents.model';
import { Gender } from '../../../models/gender.enum';
import { ICanadianStatus } from '../../../modules/msp-core/components/canadian-status/canadian-status.component';

const sha1 = require('sha1');

export enum OperationActionType {
    Add,
    Remove,
    Update
}


export class MspPerson implements ICanadianStatus {

    readonly uuid = UUID.UUID();

    relationship: Relationship;
    _status: StatusInCanada;
    additionalReason: string;
    hasCurrentMailingAddress: boolean;
    immigrationStatusChange: boolean;

    updatingPersonalInfo: boolean;
   // _currentActivity: Activities;
    documents: SupportDocuments = new SupportDocuments();
    statusChange: PersonStatusChange[];
    _currentActivity: CanadianStatusReason;
    //documents: PersonDocuments = new PersonDocuments();
    nameChangeDocs: SupportDocuments = new SupportDocuments();
    hasNameChange: boolean;

    assistYearDocs: CommonImage[] = [];

    isRemovedAtTheEndOfCurrentMonth: boolean;

    outOfBCRecord: OutofBCRecord; // do not use
    /** NEEDS XSD. Departure information for the question regarding if the person will be out of BC for more than 30 days in the next 6 months. */
    planOnBeingOutOfBCRecord: OutofBCRecord;
    private _operationActionType: OperationActionType;
    //enrollmentMember: string; //MSPEnrollementMember;
   /*
    given default value so that pleaseSelect is selected on page load
    */
    public reasonForCancellation: string = 'pleaseSelect';
    /** NEEDS XSD. User provided date for cancellation of spouse or dependent on their plan. */
    public cancellationDate: SimpleDate;

    /** NEEDS XSD. For child only. */
    private _newlyAdopted: boolean;

    public updateStatusInCanada: boolean;

    updateStatusInCanadaDocType: SupportDocuments = new SupportDocuments();
    public updateStatusInCanadaDoc: CommonImage[];
    _docType: SupportDocuments;

    public updateNameDueToMarriage: boolean;
    public updateNameDueToMarriageDocType: SupportDocuments = new SupportDocuments();
    public updateNameDueDoc: CommonImage[] = [];


    public updateNameDueToError: boolean;
    public updateNameDueToErrorDocType: SupportDocuments = new SupportDocuments();
    public updateNameDueToErrorDoc: CommonImage[] = [];

    public updateBirthdate: boolean;
     public updateBirthdateDocType:   SupportDocuments = new SupportDocuments();
    public updateBirthdateDoc: CommonImage[] = [];

    public updateGender: boolean;
    public updateGenderDocType:  SupportDocuments = new SupportDocuments();
    public updateGenderDoc: CommonImage[] = [];

    public updateGenderDesignation: boolean;
    public updateGenderDesignationDocType:  SupportDocuments = new SupportDocuments();
    public updateGenderDesignationDoc: CommonImage[] = [];
    cancellationReason: CancellationReasons;
    removedSpouseDueToDivorceDoc: SupportDocuments;


    get newlyAdopted(): boolean {
        return this._newlyAdopted;
    }

    set newlyAdopted(val: boolean){
        if (!val){
            this.adoptedDate = null;
        }
        this._newlyAdopted = val;
    }

    public adoptedDate: SimpleDate;



    get operationActionType(): OperationActionType {
        return this._operationActionType;
    }

    set operationActionType(value: OperationActionType) {
        this._operationActionType = value;
    }

    get hasDocuments(): boolean {
        return this.documents.images && this.documents.images.length > 0;
    }

    /**
     * Had episodes of leaving and returning to bc for peirod of longer than 30 days.
     */
    private _beenOutSideOver30Days: boolean;

    get beenOutSideOver30Days(): boolean {
        return this.outOfBCRecord != null;
    }

    get hasCompleteOutSideRecords(): boolean {
        const noRecords = this.outOfBCRecord == null;
        if (noRecords) return true;
        const allFilledIn = this.outOfBCRecord.isValid();
        return allFilledIn;
    }

    /**
     * Person has declared they have episodes of returning/leaving BC for longer
     * than 30 days.
     */
    private _declarationForOutsideOver30Days: boolean;

    /**
     * Automatically handles the instantiation and destruction of the
     * OutofBCRecord object. Previously this was handled in the controllers, but
     * it should be in the model as it i) is an operation purely on data ii)
     * reduces code duplication.
     */
    set declarationForOutsideOver30Days(val: boolean) {
        this._declarationForOutsideOver30Days = val;
        if (val){
            this.outOfBCRecord = new OutofBCRecord();
        }
        else {
            this.outOfBCRecord = null;
        }
    }

    get declarationForOutsideOver30Days(): boolean {
        return this._declarationForOutsideOver30Days;
    }


    private _declarationForOutsideOver60Days: boolean;

    /**
     * Automatically handles the instantiation and destruction of the
     * OutofBCRecord object. Previously this was handled in the controllers, but
     * it should be in the model as it i) is an operation purely on data ii)
     * reduces code duplication.
     */
    set declarationForOutsideOver60Days(val: boolean) {
        this._declarationForOutsideOver60Days = val;
        if (val){
            this.outOfBCRecord = new OutofBCRecord();
        }
        else {
            this.outOfBCRecord = null;
        }
    }

    get declarationForOutsideOver60Days(): boolean {
        return this._declarationForOutsideOver60Days;
    }

    departureReason: string;
    departureReason12Months: string;
    departureDestination: string;
    departureDestination12Months: string;
    departureDate: SimpleDate = { day: null, month: null, year: null };
    returnDate: SimpleDate = { day: null, month: null, year: null };

    /**
     * Name section
     */
    firstName: string;
    middleName: string;
    lastName: string;
    previouslastName: string;

    static NameRegEx = '^[a-zA-Z][a-zA-Z\\-.\' ]*$';

    /**
     * Gender
     */
    gender: Gender;

    /**
     * Date of birth section
     */
    dob_day: number = null;
    dob_month: number = null;
    dob_year: number = null;

    get hasDob(): boolean {
        return (this.dob_year != null &&
            this.dob_month != null &&
            this.dob_day != null);
    }

    get dob() {
        return this.parseDate(this.dob_year, this.dob_month, this.dob_day);
    }

    set dobSimple( dt: SimpleDate ) {
        this.dob_day = dt.day;
        this.dob_month = dt.month;
        this.dob_year = dt.year;
    }

    get dobSimple(): SimpleDate {
        return {
            'day': this.dob_day,
            'month': this.dob_month,
            'year': this.dob_year,
        };
    }

    public dateOfBirth: SimpleDate = { year: null, month: null, day: null };

    //TODO fix this..not DRY
    getCancellationDateInMoment () {
        return this.parseDate(this.cancellationDate.year, this.cancellationDate.month, this.cancellationDate.day);
    }

    getAdoptedDateInMoment (){
        return this.parseDate(this.adoptedDate.year, this.adoptedDate.month, this.adoptedDate.day);
    }



    arrivalToBCDay: number = null;
    arrivalToBCMonth: number = null;
    arrivalToBCYear: number = null;

    get hasArrivalToBC(): boolean {
        return (this.arrivalToBCDay != null &&
            this.arrivalToBCMonth != null &&
            this.arrivalToBCYear != null);
    }

    get arrivalToBC() {
        return this.parseDate(this.arrivalToBCYear, this.arrivalToBCMonth, this.arrivalToBCDay);
    }

    /** Provides the same answer as arrivalToBC but in a different format. Useful with the MspDateComponent which can take a single SimpleDate obj for configuration. */
    get arrivalToBCSimple(): SimpleDate {
        return {
            day: this.arrivalToBCDay,
            month: this.arrivalToBCMonth,
            year: this.arrivalToBCYear,
        };
    }

    /** Set the arrival to BC day/month/year by passing in a Simple object. Useful with the MspDateComponent for two-way data binding. */
    set arrivalToBCSimple(date: SimpleDate){
        this.arrivalToBCDay = date.day;
        this.arrivalToBCMonth = date.month;
        this.arrivalToBCYear = date.year;
    }

    arrivalToCanadaDay: number = null;
    arrivalToCanadaMonth: number = null;
    arrivalToCanadaYear: number = null;

    get arrivalToCanada() {
        return this.parseDate(this.arrivalToCanadaYear, this.arrivalToCanadaMonth, this.arrivalToCanadaDay);
    }

    get hasArrivalToCanada(): boolean {
        return !!(this.arrivalToCanadaDay && this.arrivalToCanadaMonth && this.arrivalToCanadaYear) ;
    }

    get arrivalToCanadaDate() {
        return {
            day: this.arrivalToCanadaDay,
            month: this.arrivalToCanadaMonth,
            year: this.arrivalToCanadaYear,
        };
    }

    set arrivalToCanadaDate(date: SimpleDate) {
        this.arrivalToCanadaDay = date.day;
        this.arrivalToCanadaMonth = date.month;
        this.arrivalToCanadaYear = date.year;
    }


    /**
     * BC Personal Health Number
     */
    previous_phn: string;

    /* TEMPORARY fix until able to refactor all code - personal information component in core
     *variable name changed from previous_phn to phn - change occurred during refactoring
     * of enrolment
     */
    get phn() {
        return this.previous_phn;
    }
    set phn( phn: string ) {
        this.previous_phn = phn;
    }
    specificMember_phn: string;

    private _hasPreviousBCPhn: boolean;

    /**
     * Health number from another province
     */
    healthNumberFromOtherProvince: string;

    institutionWorkHistory: string;

    private _hasBeenReleasedFromArmedForces: boolean;

    get hasBeenReleasedFromArmedForces(): boolean {
        return this._hasBeenReleasedFromArmedForces;
    }

    set hasBeenReleasedFromArmedForces(value: boolean) {
        this._hasBeenReleasedFromArmedForces = value;
    }

    get hasPreviousBCPhn(): boolean {
        return this._hasPreviousBCPhn;
    }

    set hasPreviousBCPhn(hasPhn: boolean) {
        if (!hasPhn) {
            this.previous_phn = null;
        }
        this._hasPreviousBCPhn = hasPhn;
    }


    /**
     * Discharge date if worked in CDN forces
     */
    dischargeYear: number = null;
    dischargeMonth: number = null;
    dischargeDay: number = null;

    hasActiveMedicalServicePlan: boolean;

    /** NEEDS XSD. Name of institute they've been discharged from. */
    nameOfInstitute: string;

    get hasDischarge(): boolean {
        return (this.dischargeDay != null &&
            this.dischargeMonth != null &&
            this.dischargeYear != null);
    }

    set dischargeDateSimple(date: SimpleDate) {
        this.dischargeDay = date.day;
        this.dischargeMonth = date.month;
        this.dischargeYear = date.year;
    }
    get dischargeDateSimple() {
        return {
            day: this.dischargeDay,
            month: this.dischargeMonth,
            year: this.dischargeYear,
        };
    }

    get dischargeDate() {
        return this.parseDate(this.dischargeYear, this.dischargeMonth, this.dischargeDay);
    }

    get isArrivalToBcBeforeDob(): boolean {
        return this.dob.isSameOrAfter(this.arrivalToBC);
    }
    get isArrivalToCanadaBeforeDob(): boolean {
        return this.dob.isSameOrAfter(this.arrivalToCanada);
    }

    get isStudyDatesInValid(): boolean {
        return this.studiesBeginDate.isSameOrAfter(this.studiesFinishedDate);
    }
    /**
     * Which province the person has moved from
     */
    movedFromProvinceOrCountry: string;

    /**
     * This property is for storing user provided answer to the following question:
     * Do you currently live in BC?
     */
    liveInBC: boolean;

    /**
     * Now ask explicitly of the user
     * If answser is NO, the livedInBCSinceBirth = false
     * See https://apps.gcpe.gov.bc.ca/jira/browse/PSPDN-398
     */
    private _livedInBCSinceBirth: boolean = null;

    get livedInBCSinceBirth(): boolean {
        return this._livedInBCSinceBirth;
    }

    set livedInBCSinceBirth(value: boolean) {
        this._livedInBCSinceBirth = value;
        if (this._livedInBCSinceBirth === true) {
            // We erase this info if they lived in BC since birth
            this.arrivalToCanadaYear = null;
            this.arrivalToCanadaMonth = null;
            this.arrivalToCanadaDay = null;
            this.arrivalToBCYear = null;
            this.arrivalToBCMonth = null;
            this.arrivalToBCDay = null;
        }
    }


    departureDateDuring12MonthsDay: number = null;
    departureDateDuring12MonthsMonth: number = null;
    departureDateDuring12MonthsYear: number = null;

    departureDateDuring6MonthsDay: number = null;
    departureDateDuring6MonthsMonth: number = null;
    departureDateDuring6MonthsYear: number = null;

    returnDate12MonthsDay: number = null;
    returnDate12MonthsMonth: number = null;
    returnDate12MonthsYear: number = null;

    returnDate6MonthsDay: number = null;
    returnDate6MonthsMonth: number = null;
    returnDate6MonthsYear: number = null;


    get departureDateDuring12Months(): SimpleDate {
        return {
            day: this.departureDateDuring12MonthsDay,
            month: this.departureDateDuring12MonthsMonth,
            year: this.departureDateDuring12MonthsYear,
        };
    }

    set departureDateDuring12Months(date: SimpleDate){
        this.departureDateDuring12MonthsDay = date.day;
        this.departureDateDuring12MonthsMonth = date.month;
        this.departureDateDuring12MonthsYear = date.year;
    }

    get departureDateDuring6Months(): SimpleDate {
        return {
            day: this.departureDateDuring6MonthsDay,
            month: this.departureDateDuring6MonthsMonth,
            year: this.departureDateDuring6MonthsYear,
        };
    }

    set departureDateDuring6Months(date: SimpleDate){
        this.departureDateDuring6MonthsDay = date.day;
        this.departureDateDuring6MonthsMonth = date.month;
        this.departureDateDuring6MonthsYear = date.year;
    }

    set returnDateDuring12Months(date: SimpleDate){
        this.returnDate12MonthsDay = date.day;
        this.returnDate12MonthsMonth = date.month;
        this.returnDate12MonthsYear = date.year;
    }

    get returnDateDuring12Months(): SimpleDate {
        return {
            day: this.returnDate12MonthsDay,
            month: this.returnDate12MonthsMonth,
            year: this.returnDate12MonthsYear,
        };
    }

    set returnDateDuring6Months(date: SimpleDate){
        this.returnDate6MonthsDay = date.day;
        this.returnDate6MonthsMonth = date.month;
        this.returnDate6MonthsYear = date.year;
    }

    get returnDateDuring6Months(): SimpleDate {
        return {
            day: this.returnDate6MonthsDay,
            month: this.returnDate6MonthsMonth,
            year: this.returnDate6MonthsYear,
        };
    }


    madePermanentMoveToBC: boolean;
    private _plannedAbsence: boolean;

    /**
     * This property is for storing user provided answer to the following question:
     * > Are you planning to leave BCfor longer than 30 days in the next six months?
     *
     */
    get plannedAbsence(): boolean {
        return this._plannedAbsence;
    }

    set plannedAbsence(val: boolean){
        this._plannedAbsence = val;
        if (val){
            this.planOnBeingOutOfBCRecord = new OutofBCRecord();
        }
        else {
            this.planOnBeingOutOfBCRecord = null;
        }
    }

    get ineligibleForMSP(): boolean {
        return (this.madePermanentMoveToBC === false /* && (
            this.status === StatusInCanada.CitizenAdult ||
            this.status === StatusInCanada.PermanentResident)*/);
    }

    get bcServiceCardShowStatus(): boolean {

        return this.status === StatusInCanada.CitizenAdult
            || this.status === StatusInCanada.PermanentResident ;
    }

    /** Used for dependents and spouses to check if they are  an existing MSP Beneficiary. */
    isExistingBeneficiary: boolean;
    /** Only for spouse. Previous last name. */
    prevLastName: string;
    /** Only for spouse. Marriage date to applicant. */
    //marriageDate: SimpleDate = { day: null, month: null, year: null };


    marriageDateDay: number = null;
    marriageDateMonth: number = null;
    marriageDateYear: number = null;

    get marriageDate(): SimpleDate {
        return {
            day: this.marriageDateDay,
            month: this.marriageDateMonth,
            year: this.marriageDateYear,
        };
    }

    set marriageDate(date: SimpleDate){
        this.marriageDateDay = date.day;
        this.marriageDateMonth = date.month;
        this.marriageDateYear = date.year;
    }




    fullTimeStudent: boolean;
    inBCafterStudies: boolean;

    /**
     * For children 19-24, we need the school name and address
     */
    schoolName: string;
    schoolAddress: Address = new Address();

    /** Needs XSD.  */
    schoolOutsideOfBC: boolean;

    // for account management , spouse and child can have address
    // Address and Contact Info
    public residentialAddress: Address = new Address();
    public mailingSameAsResidentialAddress: boolean = true;
    public mailingAddress: Address = new Address();
    public phoneNumber: string;

    /** Only useful if person is spouse. Answers the question: "Do you know your Spouses' current mailing address?" */
    private _knownMailingAddress: boolean;

    get knownMailingAddress(): boolean {
        return this._knownMailingAddress;
    }

    set knownMailingAddress(val: boolean){

        if (!val){
            //NOTE - FDS page 51 says residentialAddress should be "Unknown" now?
            this.residentialAddress = new Address();
            // this.residentialAddress = "Unknown";
            this.mailingSameAsResidentialAddress = true;
            this.mailingAddress = new Address();
        }

        this._knownMailingAddress = val;
    }


    /**
     * validator for phone number
     * @returns {boolean}
     */
    get phoneNumberIsValid(): boolean {

        // Phone is optional
        if (this.phoneNumber == null ||
            this.phoneNumber.length < 1) {
            return true;
        }

        // But if it's provided is must be valid
        const regEx = new RegExp(PhoneNumber.PhoneNumberRegEx);
        return regEx.test(this.phoneNumber);
    }


    /**
     * NEEDS XSD.
     * When the student expects to finish.
     */
    studiesBeginYear: number;
    studiesBeginMonth: number;
    studiesBeginDay: number;

    get studiesBeginDate() {
        return this.parseDate(this.studiesBeginYear, this.studiesBeginMonth, this.studiesBeginDay);
    }

    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    get studiesBeginSimple(): SimpleDate {
        return {
            'year': this.studiesBeginYear,
            'month': this.studiesBeginMonth,
            'day': this.studiesBeginDay,
        };
    }

    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    set studiesBeginSimple(date: SimpleDate) {
        this.studiesBeginYear = date.year;
        this.studiesBeginMonth = date.month;
        this.studiesBeginDay = date.day;
    }


    /**
     * When the student expects to finish
     */
    studiesFinishedYear: number = null;
    studiesFinishedMonth: number = null;
    studiesFinishedDay: number = null;

    get hasStudiesFinished(): boolean {
        return (this.studiesFinishedDay != null &&
            this.studiesFinishedMonth != null &&
            this.studiesFinishedYear != null);
    }

    get hasStudiesBegin(): boolean {
        return (this.studiesBeginDay != null &&
            this.studiesBeginMonth != null &&
            this.studiesBeginYear != null);
    }


    get studiesFinishedDate() {
        return this.parseDate(this.studiesFinishedYear, this.studiesFinishedMonth, this.studiesFinishedDay);
    }


    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    get studiesFinishedSimple(): SimpleDate {
        return {
            'year': this.studiesFinishedYear,
            'month': this.studiesFinishedMonth,
            'day': this.studiesFinishedDay,
        };
    }

    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    set studiesFinishedSimple(date: SimpleDate){
        this.studiesFinishedYear = date.year;
        this.studiesFinishedMonth = date.month;
        this.studiesFinishedDay = date.day;
    }

    /**
     * If school outside BC when did they leave
     */
    studiesDepartureYear: number = null;
    studiesDepartureMonth: number = null;
    studiesDepartureDay: number = null;

    get hasStudiesDeparture(): boolean {
        return (this.studiesDepartureDay != null &&
            this.studiesDepartureMonth != null &&
            this.studiesDepartureYear != null);
    }

    get studiesDepartureDate() {
        return this.parseDate(this.studiesDepartureYear, this.studiesDepartureMonth, this.studiesDepartureDay);
    }

    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    get studiesDepartureSimple(): SimpleDate {
        return {
            'year': this.studiesDepartureYear,
            'month': this.studiesDepartureMonth,
            'day': this.studiesDepartureDay,
        };
    }

    /** A wrapper of the studies finished dates, so that we can easily setup two-way data binding with the <common-date> component. */
    set studiesDepartureSimple(date: SimpleDate){
        this.studiesDepartureYear = date.year;
        this.studiesDepartureMonth = date.month;
        this.studiesDepartureDay = date.day;
    }

    get status() {
        return this._status;
    }

    set status(st: StatusInCanada) {
        this._status = st;
        if (this._status === StatusInCanada.PermanentResident
            || this._status === StatusInCanada.TemporaryResident) {
            this._livedInBCSinceBirth = false;
        }
    }

    get docType() {
        return this._docType;
    }

    set docType(doc: SupportDocuments) {
        this._docType = doc;
    }

    get currentActivity() {
        return this._currentActivity;
    }

    /**
     * All activies in the system now indicates that person has not lived in BC since birth.
     */
    set currentActivity(act: CanadianStatusReason) {
        this._currentActivity = act;
    }

    get hasFullName(): boolean {
        return (this.firstName != null &&
            this.lastName != null);
    }

    get fullName(): string {
        let fullName = this.firstName;
        if (this.middleName != null &&
            this.middleName.length > 0) {
            fullName += ' ' + this.middleName;
        }
        fullName += ' ' + this.lastName;

        return fullName;
    }

    isDiplomat = () => {
        return this.status === StatusInCanada.TemporaryResident && this.currentActivity === CanadianStatusReason.Diplomat;
    }

    isVisitor = () => {
        return this.status === StatusInCanada.TemporaryResident && this.currentActivity === CanadianStatusReason.Visiting;
    }



    /**
     * Social Insurance Number
     */
    sin: string;

    id: string;

    //OperationActionType Pass it only for Account Management..Optional param
    constructor(rel: Relationship, operationActionType ?: OperationActionType) {
        this.relationship = rel;
        this.operationActionType = operationActionType;
        this.id = sha1(new Date().getTime()).substring(0, 9);
        this.residentialAddress.province = BRITISH_COLUMBIA;
        this.residentialAddress.country = CANADA;
    }

    private parseDate(year: number, month: number, day: number) {
        return moment.utc({
            year: year,
            month: month - 1, // moment use 0 index for month :(
            day: day,
        }); // use UTC mode to prevent browser timezone shifting
    }

    private isNotEmpty(thing: any): boolean {
        return thing !== null && thing !== undefined;
    }

    /**
     *   0: 'Living in BC without MSP',
     *   1: 'Moving from another province',
     *   2: 'Moving from another country',
     *   3: 'Working in BC',
     *   4: 'Studying in BC',
     *   5: 'Religious worker',
     *   6: 'Diplomat'
     */
    get isInfoComplete() {
        // console.log('check data completeness for: ' + Relationship[this.relationship]);

        let basic = _.isString(this.gender)
            && _.isString(this.firstName) && this.firstName.length > 0 && _.isString(this.lastName) && this.lastName.length > 0
            && _.isNumber(this.dob_day) && _.isString(this.dob_month) && _.isNumber(this.dob_year) && !(this.dob_month === 0)
            && _.isNumber(this._status) && _.isNumber(this._currentActivity) && this.documents.images.length > 0
            && !(this.studiesDepartureMonth === 0)
            && !(this.studiesFinishedMonth === 0)
            && _.isBoolean(this._declarationForOutsideOver30Days)
            && !(this.outOfBCRecord && this.outOfBCRecord.departureMonth === 0)
            && !(this.outOfBCRecord && this.outOfBCRecord.returnMonth === 0)
            && !(this.dischargeDate && this.dischargeMonth === 0);
        let returningToBCComplete = true;

        // Check name regexs
        const regEx = new RegExp(MspPerson.NameRegEx);
        basic = basic && regEx.test(this.firstName);
        if (this.middleName &&
            this.middleName.length > 0) {
            basic = basic && regEx.test(this.middleName);
        }
        basic = basic && regEx.test(this.lastName);

        // code 0 is "Lived in BC without MSP"
        if (this.currentActivity === 0) {
            returningToBCComplete = _.isBoolean(this.hasPreviousBCPhn);

            if (this.status === StatusInCanada.CitizenAdult) {
                returningToBCComplete = returningToBCComplete && _.isBoolean(this.livedInBCSinceBirth);
            }
        }

        // code 1 is "Moving from another province"
        let movingFromAnotherProvinceComplete = true;
        if (this.currentActivity === 1) {
            movingFromAnotherProvinceComplete = _.isString(this.movedFromProvinceOrCountry) && this.movedFromProvinceOrCountry.length > 1;
        }

        let movingFromAnotherCountryComplete = true;
        if (this.currentActivity === 2 || this.status === 2) {
            movingFromAnotherCountryComplete = _.isString(this.movedFromProvinceOrCountry) && this.movedFromProvinceOrCountry.length > 1;
        }

        let studentComplete: boolean = true;
        if (this.relationship === Relationship.Applicant || this.relationship === Relationship.Child19To24) {
            studentComplete = _.isBoolean(this.fullTimeStudent);
            if (studentComplete && this.fullTimeStudent) {
                studentComplete = _.isBoolean(this.inBCafterStudies);
            }
        }

        // check spouse
        let spouseComplete: boolean = true;
        if (this.relationship === Relationship.Spouse) {
            // must be not in the future
            spouseComplete = this.dob.isBefore(moment());
        }

        // applicant 16 and older
        let applicant16OrOlderComplete = true;
        if (this.relationship === Relationship.Applicant &&
            this.hasDob) {
            applicant16OrOlderComplete = !this.dob.isAfter(moment().subtract(16, 'years'));
        }


        let ageOver19ChildComplete = true;
        if (this.relationship === Relationship.Child19To24) {
            const tooYoung = this.dob.isAfter(moment().subtract(19, 'years'));
            const tooOld = this.dob.isBefore(moment().subtract(24, 'years'));
            ageOver19ChildComplete = !tooOld && !tooYoung;

            if (this.fullTimeStudent) {
                ageOver19ChildComplete = ageOver19ChildComplete && !!this.schoolName && _.isString(this.schoolName) && this.schoolName.length > 0
                    && _.isNumber(this.studiesFinishedYear) && _.isString(this.studiesFinishedMonth) && _.isNumber(this.studiesFinishedDay)
                    && this.schoolAddress.isValid;
            } else {
                //must be a full time student
                ageOver19ChildComplete = false;
            }
        }

        let ageUnder19ChildComplete = true;
        if (this.relationship === Relationship.ChildUnder19) {
            const lessThan19 = this.dob.isAfter(moment().subtract(19, 'years'));
            ageUnder19ChildComplete = lessThan19;
        }

        let institutionWorkComplete = true;
        if (this.currentActivity === 1 || this.currentActivity === 0) {
            institutionWorkComplete = _.isString(this.institutionWorkHistory)
                && (this.institutionWorkHistory.toLowerCase() === 'yes' || this.institutionWorkHistory.toLowerCase() === 'no');
            if (institutionWorkComplete && this.institutionWorkHistory.toLowerCase() === 'yes') {
                institutionWorkComplete = _.isNumber(this.dischargeDay) && _.isString(this.dischargeMonth) && _.isNumber(this.dischargeYear);
            }
        }


        let arrivalToBCCompete = true;
        if (this.livedInBCSinceBirth === null || this.livedInBCSinceBirth === false) {
            arrivalToBCCompete = this.arrivalToBCMonth > 0 && _.isNumber(this.arrivalToBCYear)
                && _.isNumber(this.arrivalToBCDay);
        }

        let arrivalInCanadaComplete = true;
        if (!(this.status === StatusInCanada.CitizenAdult &&
                (this.currentActivity === CanadianStatusReason.MovingFromProvince ||
                    this.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP))) {
            arrivalInCanadaComplete = _.isNumber(this.arrivalToCanadaDay) && _.isString(this.arrivalToCanadaMonth) && _.isNumber(this.arrivalToCanadaYear);
        }
        const result = basic
            && returningToBCComplete
            && arrivalToBCCompete
            && arrivalInCanadaComplete
            && movingFromAnotherProvinceComplete
            && movingFromAnotherCountryComplete
            && institutionWorkComplete
            && applicant16OrOlderComplete
            && ageUnder19ChildComplete
            && ageOver19ChildComplete
            && studentComplete
            && spouseComplete
            && this.hasCompleteOutSideRecords;

        // console.log(Relationship[this.relationship] + ' data completed? ' + result);
        return result;
    }
}
