import {OutofBCRecord} from '../../../models/outof-bc-record.model';
import {UUID} from 'angular2-uuid';
import * as _ from 'lodash';
import {PhoneNumber} from './phone.model';
import { PersonStatusChange } from './person-status-change';
import { Address, BRITISH_COLUMBIA, CANADA, CommonImage } from 'moh-common-lib';
import { CanadianStatusReason, StatusInCanada } from '../../../modules/msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { CancellationReasons } from 'app/models/status-activities-documents';
import { SupportDocuments } from '../../../modules/msp-core/models/support-documents.model';
import { Gender } from '../../../models/gender.enum';
import { ICanadianStatus } from '../../../modules/msp-core/components/canadian-status/canadian-status.component';
import { compareAsc, isBefore, startOfToday, isAfter, subYears } from 'date-fns';

const sha1 = require('sha1');

export enum OperationActionType {
    Add,
    Remove,
    Update
}


export class MspPerson implements ICanadianStatus {

    readonly uuid = UUID.UUID();
    readonly phnRequired = true;
    readonly sinRequired = true;

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
    public cancellationDate: Date;

    /** NEEDS XSD. For child only. */
    private _newlyAdopted: boolean;

    public updateStatusInCanada: boolean;

    updateStatusInCanadaDocType: SupportDocuments = new SupportDocuments();
    public updateStatusInCanadaDoc: CommonImage[];
    _docType: SupportDocuments;

    public updateNameDueToMarriage: boolean;
    public updateNameDueToMarriageRequestedLastName: string;
    public updateNameDueToMarriageDocType: SupportDocuments = new SupportDocuments();
    public updateNameDueToMarriageDoc: CommonImage[] = [];

    public updateNameDueToNameChange: boolean;
    public updateNameDueToNameChangeDocType: SupportDocuments = new SupportDocuments();
    public updateNameDueToNameChangeDoc: CommonImage[] = [];

    public updateNameDueToError: boolean;
    public updateNameDueToErrorDocType: SupportDocuments = new SupportDocuments();
    public updateNameDueToErrorDoc: CommonImage[] = [];

    public updateBirthdate: boolean;
    public updateBirthdateDocType: SupportDocuments = new SupportDocuments();
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

    public adoptedDate: Date;



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
    departureDate: Date;
    returnDate: Date;
    returnDate12MonthsDate: Date;
    returnDate6MonthsDate: Date;

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


    get hasDob() {
        return !!this.dateOfBirth;
    }

    dateOfBirth: Date;
    get dob() { return this.dateOfBirth; }
    set dob( dt: Date ) { this.dateOfBirth = dt; }

    arrivalToBCDate: Date;
    get hasArrivalToBC() { return !!this.arrivalToBCDate; }

    arrivalToCanadaDate: Date;
    get hasArrivalToCanada() { return !!this.arrivalToCanadaDate; }

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
    hasActiveMedicalServicePlan: boolean;

    /** NEEDS XSD. Name of institute they've been discharged from. */
    nameOfInstitute: string;

    get hasDischarge(): boolean {
        return !!this.dischargeDate;
    }

    dischargeDate: Date;


    get isArrivalToBcBeforeDob(): boolean {
        return compareAsc(this.dateOfBirth, this.arrivalToBCDate) >= 0;
    }
    get isArrivalToCanadaBeforeDob(): boolean {
        return compareAsc(this.dateOfBirth, this.arrivalToCanadaDate) >= 0;
    }

    get isStudyDatesInValid(): boolean {
        return compareAsc( this.studiesBeginDate, this.studiesFinishedDate ) > 0 ;
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

            this.arrivalToCanadaDate = undefined;
            this.arrivalToCanadaDate = undefined;
        }
    }

    departureDateDuring12MonthsDate: Date;
    departureDateDuring6MonthsDate: Date;
    returnDateDuring12MonthsDate: Date;
    returnDateDuring6MonthsDate: Date;

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
    //marriageDate: Date = { day: null, month: null, year: null };


    marriageDate: Date;


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


    studiesBeginDate: Date;
    get hasStudiesBegin() {
        return !!this.studiesBeginDate;
    }
    studiesFinishedDate: Date;
    get hasStudiesFinished() {
        return !!this.studiesFinishedDate;
    }
    studiesDepartureDate: Date;
    get hasStudiesDeparture() {
        return !!this.studiesDepartureDate;
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
            && _.isString(this.firstName) && this.firstName.length > 0
            && _.isString(this.lastName) && this.lastName.length > 0
            && this.dateOfBirth
            && _.isNumber(this._status) && _.isNumber(this._currentActivity)
            && this.documents.images.length > 0
            && this.studiesDepartureDate
            && this.studiesFinishedDate
            && _.isBoolean(this._declarationForOutsideOver30Days)
            && (this.outOfBCRecord && this.outOfBCRecord.departureDate )
            && !!this.dischargeDate;
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
            spouseComplete = isBefore( this.dateOfBirth, startOfToday() );
        }

        // applicant 16 and older
        let applicant16OrOlderComplete = true;
        if (this.relationship === Relationship.Applicant &&
            this.hasDob) {
            applicant16OrOlderComplete = !isAfter(this.dateOfBirth, subYears( startOfToday(), 16));
        }


        let ageOver19ChildComplete = true;
        if (this.relationship === Relationship.Child19To24) {
            const tooYoung = isAfter(this.dateOfBirth, subYears( startOfToday(), 19));
            const tooOld = isBefore(this.dateOfBirth, subYears( startOfToday(), 24) );
            ageOver19ChildComplete = !tooOld && !tooYoung;

            if (this.fullTimeStudent) {
                ageOver19ChildComplete = ageOver19ChildComplete && !!this.schoolName && _.isString(this.schoolName) && this.schoolName.length > 0
                    && !!this.studiesFinishedDate
                    && this.schoolAddress.isValid;
            } else {
                //must be a full time student
                ageOver19ChildComplete = false;
            }
        }

        let ageUnder19ChildComplete = true;
        if (this.relationship === Relationship.ChildUnder19) {
            const lessThan19 = isAfter(this.dateOfBirth, subYears( startOfToday(), 19) );
            ageUnder19ChildComplete = lessThan19;
        }

        let institutionWorkComplete = true;
        if (this.currentActivity === 1 || this.currentActivity === 0) {
            institutionWorkComplete = _.isString(this.institutionWorkHistory)
                && (this.institutionWorkHistory.toLowerCase() === 'yes' || this.institutionWorkHistory.toLowerCase() === 'no');
            if (institutionWorkComplete && this.institutionWorkHistory.toLowerCase() === 'yes') {
                institutionWorkComplete = !!this.dischargeDate;
            }
        }


        let arrivalToBCCompete = true;
        if (this.livedInBCSinceBirth === null || this.livedInBCSinceBirth === false) {
            arrivalToBCCompete = !!this.arrivalToBCDate;
        }

        let arrivalInCanadaComplete = true;
        if (!(this.status === StatusInCanada.CitizenAdult &&
                (this.currentActivity === CanadianStatusReason.MovingFromProvince ||
                    this.currentActivity === CanadianStatusReason.LivingInBCWithoutMSP))) {
            arrivalInCanadaComplete = !!this.arrivalToCanadaDate;
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
