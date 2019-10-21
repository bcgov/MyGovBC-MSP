import { Injectable } from '@angular/core';
import { BaseMspDataService } from '../../../services/base-msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import EnrolApplicationDto, { EnrolApplication } from '../models/enrol-application';
import EnrolleeDto, { Enrollee } from '../models/enrollee';
import { SupportDocuments } from '../../msp-core/models/support-documents.model';
import AddressDto from '../../../models/address.dto';

@Injectable({
  providedIn: 'root'
})
export class EnrolDataService extends BaseMspDataService {

  protected _storageKey: string = 'msp-application';

  application: EnrolApplication;
  pageStatus: any[] = [];

  constructor( protected localStorageService: LocalStorageService ) {
    super( localStorageService );

    // Storage key for enrolment pages
    this._pageStorageKey = 'msp-enrol-pages';

    this.pageStatus = this.fetchPageStatus();
    this.application = this.fetchApplication();
   }

  // Saving Enrolment data into local storage
  saveApplication(): void {
    const dto: EnrolApplicationDto = this.toTransferObject( this.application );
    this.localStorageService.set( this._storageKey, dto );
    this.savePageStatus( this.pageStatus );
  }

  // Remove Enrolment data from local storage
  removeApplication(): void {
    this.destroyAll();
    this.application = new EnrolApplication();
  }


  // TODO: Build
  private toTransferObject( input: EnrolApplication ): EnrolApplicationDto {

    const dto: EnrolApplicationDto = this.toBaseApplicationTransferObject<EnrolApplicationDto>( input, EnrolApplicationDto );
    dto.liveInBC = input.liveInBC;
    dto.plannedAbsence = input.plannedAbsence;
    dto.unUsualCircumstance = input.unUsualCircumstance;

    dto.applicant = this.toEnrolleeTranferObject( input.applicant );
    if ( input.spouse ) {
      dto.spouse = this.toEnrolleeTranferObject( input.spouse );
    }

    if ( input.children && input.children.length > 0 ) {
      input.children.forEach( c => {
        dto.children = [...dto.children, this.toEnrolleeTranferObject( c )];
      });
    }

   return dto;
  }

  private fromTransferObject( dto: EnrolApplicationDto ): EnrolApplication {

    const output: EnrolApplication = this.fromBaseApplicationTransferObject<EnrolApplication>( dto, EnrolApplication );
    output.liveInBC = dto.liveInBC;
    output.plannedAbsence = dto.plannedAbsence;
    output.unUsualCircumstance = dto.unUsualCircumstance;

    output.applicant = this.fromEnrolleeTranferObject( dto.applicant );
    if ( dto.spouse ) {
      output.spouse = this.fromEnrolleeTranferObject( dto.spouse );
    }

    if ( dto.children && dto.children.length > 0 ) {
      dto.children.forEach( c => {
        output.children = [...output.children, this.fromEnrolleeTranferObject( c )];
      });
    }

    return output;
  }

  /** Retrieve data from storage */
  private fetchApplication(): EnrolApplication {

    const dto: EnrolApplicationDto = this.localStorageService.get<EnrolApplicationDto>( this._storageKey );
    if (dto) {
      return this.fromTransferObject( dto );
    }
    return new EnrolApplication();
  }


  private fromEnrolleeTranferObject( dto: EnrolleeDto ): Enrollee {

    const output: Enrollee = this.fromBasePersonTransferObject<Enrollee>( dto, Enrollee );

    output.relationship = dto.relationship;
    output.status = dto.status;
    output.currentActivity = dto.currentActivity;

    output.hasNameChange = dto.hasNameChange;

    // SupportDocument
    output.nameChangeDocs = this.fromSupportDocumentTransferObject( dto.nameChangeDocs );

    // Moving information
    output.madePermanentMoveToBC = dto.madePermanentMoveToBC;
    output.livedInBCSinceBirth = dto.livedInBCSinceBirth;

    // School information for full-time students
    output.fullTimeStudent = dto.fullTimeStudent;
    output.inBCafterStudies = dto.inBCafterStudies;

    // For children 19-24, we need the school name and address
    output.schoolName = dto.schoolName;

    output.schoolAddress = this.fromAddressTransferObject( dto.schoolAddress );
    output.schoolCompletionDt = dto.schoolCompletionDt;
    output.departureDtForSchool = dto.departureDtForSchool;

    console.log( 'fromEnrolleeTranferObject: ', output );

    return output;
  }

  private toEnrolleeTranferObject( input: Enrollee ): EnrolleeDto {

    const dto: EnrolleeDto = this.toBasePersonTransferObject<EnrolleeDto>( input, EnrolleeDto );

    dto.relationship = input.relationship;
    dto.status = input.status;
    dto.currentActivity = input.currentActivity;

    dto.hasNameChange = input.hasNameChange;

    // SupportDocuments
    dto.nameChangeDocs = this.toSupportDocumentTransferObject( input.nameChangeDocs );

    // Moving information
    dto.madePermanentMoveToBC = input.madePermanentMoveToBC;
    dto.livedInBCSinceBirth = input.livedInBCSinceBirth;
    dto.movedFromProvinceOrCountry = input.movedFromProvinceOrCountry;

    // Arrival in dates (BC/Canaada)
    dto.arrivalToBCDt = input.arrivalToBCDt;
    dto.arrivalToCanadaDt = input.arrivalToCanadaDt;

    // Health numbers
    dto.healthNumberFromOtherProvince = input.healthNumberFromOtherProvince;
    dto.hasPreviousBCPhn = input.hasPreviousBCPhn;
    dto.previousBCPhn = input.previousBCPhn;

    // Out of Province within last 12 months for more than 30 days
    dto.declarationForOutsideOver30Days = input.declarationForOutsideOver30Days;
    dto.departureReason = input.departureReason;
    dto.departureDestination = input.departureDestination;
    dto.oopDepartureDt = input.oopDepartureDt;
    dto.oopReturnDt = input.oopReturnDt;

    // Armed Forces
    dto.hasBeenReleasedFromArmedForces = input.hasBeenReleasedFromArmedForces;
    dto.dischargeDt = input.dischargeDt;

    // School information for full-time students
    dto.fullTimeStudent = input.fullTimeStudent;
    dto.inBCafterStudies = input.inBCafterStudies;

    // For children 19-24, we need the school name and address
    dto.schoolName = input.schoolName;

    dto.schoolAddress = this.toAddressTransferObject( input.schoolAddress );
    dto.schoolCompletionDt = input.schoolCompletionDt;
    dto.departureDtForSchool = input.departureDtForSchool;

    console.log( 'toEnrolleeTranferObject: ', dto );

    return dto;
  }
}
