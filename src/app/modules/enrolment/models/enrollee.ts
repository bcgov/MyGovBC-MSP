import { ICanadianStatus } from '../../msp-core/components/canadian-status/canadian-status.component';
import BasePersonDto, { BasePerson } from '../../../models/base-person';
import { StatusInCanada, CanadianStatusReason } from '../../msp-core/models/canadian-status.enum';
import { Relationship } from '../../../models/relationship.enum';
import { Address, SimpleDate } from 'moh-common-lib';
import SupportDocumentsDto, { SupportDocuments } from '../../msp-core/models/support-documents.model';
import AddressDto from '../../../models/address.dto';

export class Enrollee extends BasePerson implements ICanadianStatus {

  // Canadian status component
  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;
  clearData(x: any): void {
    console.log('clearData: ', x);
  }

  hasNameChange: boolean;
  nameChangeDocs: SupportDocuments = new SupportDocuments();

  // Moving information
  madePermanentMoveToBC: boolean;
  livedInBCSinceBirth: boolean;
  movedFromProvinceOrCountry: string;

  // Arrival in dates (BC/Canaada)
  arrivalToBCDate: SimpleDate;
  arrivalToCanadaDate: SimpleDate;

  // Out of Province within last 12 months for more than 30 days
  outsideBCFor30Days: boolean;
  departureReason: string;
  departureDestination: string;
  oopDepartureDate: SimpleDate;
  oopReturnDate: SimpleDate;

  // health numbers
  healthNumberFromOtherProvince: string;
  hasPreviousBCPhn: boolean;
  previousBCPhn: string;

  // Armed Forces
  hasBeenReleasedFromArmedForces: boolean;
  dischargeDate: SimpleDate;

  // School information for full-time students
  fullTimeStudent: boolean;
  inBCafterStudies: boolean;

   // For children 19-24, we need the school name and address
  schoolName: string;
  schoolAddress: Address = new Address();
  schoolCompletionDate: SimpleDate;

  // If school out BC, require departure date
  departureDateForSchool: SimpleDate;

  constructor( rel?: Relationship) {
    super();
    if ( rel !== null ) {
      this.relationship = rel;
    }
  }
}

export default class EnrolleeDto extends BasePersonDto {

  status: StatusInCanada;
  currentActivity: CanadianStatusReason;
  relationship: Relationship;

  hasNameChange: boolean;

  // SupportDocuments
  nameChangeDocs: SupportDocumentsDto;

  // Moving information
  madePermanentMoveToBC: boolean;
  livedInBCSinceBirth: boolean;
  movedFromProvinceOrCountry: string;

   // Arrival in dates (BC/Canaada)
   arrivalToBCDate: SimpleDate;
   arrivalToCanadaDate: SimpleDate;

   // Health numbers
   healthNumberFromOtherProvince: string;
   hasPreviousBCPhn: boolean;
   previousBCPhn: string;

  // Out of Province within last 12 months for more than 30 days
  outsideBCFor30Days: boolean;
  departureReason: string;
  departureDestination: string;
  oopDepartureDate: SimpleDate;
  oopReturnDate: SimpleDate;

  // Armed Forces
  hasBeenReleasedFromArmedForces: boolean;
  dischargeDate: SimpleDate;

  // School information for full-time students
  fullTimeStudent: boolean;
  inBCafterStudies: boolean;

  // For children 19-24, we need the school name and address
  schoolName: string;
  schoolAddress: AddressDto;
  schoolCompletionDate: SimpleDate;
  departureDateForSchool: SimpleDate;
}
