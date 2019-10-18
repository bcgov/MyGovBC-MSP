import { ICanadianStatus } from '../../msp-core/components/canadian-status/canadian-status.component';
import BasePersonDto, { BasePerson } from '../../../models/base-person';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { Address, SimpleDate } from 'moh-common-lib';
import { SupportDocuments } from '../../msp-core/models/support-documents.model';

export class Enrollee extends BasePerson implements ICanadianStatus {

  // Canadian status component
  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;
  //clearData?: (x: any) => {};

  hasNameChange: boolean;
  nameChangeDocs: SupportDocuments = new SupportDocuments();


  // Moving information
  madePermanentMoveToBC: boolean;
  livedInBCSinceBirth: boolean;
  movedFromProvinceOrCountry: string;

  // Arrival in dates (BC/Canaada)
  arrivalToBCDt: Date; // TODO: Rename to arrivalToBCDate
  // TODO: Remove move once DateComponent if fixed
  get arrivalToBCDate() {
    return this.convertToSimpleDt( this.arrivalToBCDt );
  }
  set arrivalToBCDate( dt: SimpleDate ) {
    this.arrivalToBCDt = this.convertToDate( dt );
  }

  arrivalToCanadaDt: Date; // TODO: Rename to arrivalToCanadaDate
  // TODO: Remove move once DateComponent if fixed
  get arrivalToCanadaDate() {
    return this.convertToSimpleDt( this.arrivalToCanadaDt );
  }
  set arrivalToCanadaDate( dt: SimpleDate ) {
    this.arrivalToCanadaDt = this.convertToDate( dt );
  }


  // Out of Province within last 12 months for more than 30 days
  declarationForOutsideOver30Days: boolean;
  departureReason: string;
  departureDestination: string;

  oopDepartureDt: Date;
  get oopDepartureDate() {
    return this.convertToSimpleDt( this.oopDepartureDt );
  }
  set oopDepartureDate( dt: SimpleDate ) {
    this.oopDepartureDt = this.convertToDate( dt );
  }

  oopReturnDt: Date;
  get oopReturnDate() {
    return this.convertToSimpleDt( this.oopReturnDt );
  }
  set oopReturnDate( dt: SimpleDate ) {
    this.oopReturnDt = this.convertToDate( dt );
  }

  // health numbers
  healthNumberFromOtherProvince: string;
  hasPreviousBCPhn: boolean;
  previousBCPhn: string;

  // Armed Forces
  hasBeenReleasedFromArmedForces: boolean;
  dischargeDt: Date;
  get dischargeDate() {
    return this.convertToSimpleDt( this.dischargeDt );
  }
  set dischargeDate( dt: SimpleDate ) {
    this.dischargeDt = this.convertToDate( dt );
  }

  // School information for full-time students
  fullTimeStudent: boolean = false;
  inBCafterStudies: boolean;

   // For children 19-24, we need the school name and address
  schoolName: string;
  schoolAddress: Address = new Address();
  schoolCompletionDt: Date;
  get schoolCompletionDate() {
    return this.convertToSimpleDt( this.schoolCompletionDt );
  }
  set schoolCompletionDate( dt: SimpleDate ) {
    this.schoolCompletionDt = this.convertToDate( dt );
  }

  // If school out BC, require departure date
  departureDtForSchool: Date;
  get departureDateForSchool() {
    return this.convertToSimpleDt( this.departureDtForSchool );
  }
  set departureDateForSchool( dt: SimpleDate ) {
    this.departureDtForSchool = this.convertToDate( dt );
  }


  constructor( rel: Relationship = null ) {
    super();
    if ( rel ) {
      this.relationship = rel;
    }
  }
}

export default class EnrolleeDto extends BasePersonDto {

  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;

  hasNameChange: boolean;
  nameChangeDocs: SupportDocuments = new SupportDocuments();

  // Moving information
  madePermanentMoveToBC: boolean;
  livedInBCSinceBirth: boolean;
  movedFromProvinceOrCountry: string;

   // Arrival in dates (BC/Canaada)
   arrivalToBCDt: Date;
   arrivalToCanadaDt: Date;

   // Health numbers
   healthNumberFromOtherProvince: string;
   hasPreviousBCPhn: boolean;
   previousBCPhn: string;

  // Out of Province within last 12 months for more than 30 days
  declarationForOutsideOver30Days: boolean;
  departureReason: string;
  departureDestination: string;
  oopDepartureDt: Date;
  oopReturnDt: Date;

  // Armed Forces
  hasBeenReleasedFromArmedForces: boolean;
  dischargeDt: Date;
}
