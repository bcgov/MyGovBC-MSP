import { Injectable } from '@angular/core';
import { BaseMspDataService } from '../../../services/base-msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import EnrolApplicationDto, { EnrolApplication } from '../models/enrol-application';
import EnrolleeDto, { Enrollee } from '../models/enrollee';

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
    console.log( 'saveApplication (enrolment)' );
    const dto: EnrolApplicationDto = this.toTransferObject( this.application );
    this.localStorageService.set( this._storageKey, dto );
    this.savePageStatus( this.pageStatus );
  }

  // Remove Enrolment data from local storage
  removeApplication(): void {
    console.log( 'removeApplication (enrolment)' );
    this.destroyAll();
    this.application = new EnrolApplication();
  }


  // TODO: Build
  private toTransferObject( input: EnrolApplication ): EnrolApplicationDto {

    const dto: EnrolApplicationDto = this.toBaseApplicationTransferObject( input, EnrolApplicationDto );
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

    const output: EnrolApplication = this.fromBaseApplicationTransferObject( dto, EnrolApplication );
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
    console.log( 'fetchApplication (enrolment)', dto );
    if (dto) {
      return this.fromTransferObject( dto );
    }
    return new EnrolApplication();
  }


  private fromEnrolleeTranferObject( dto: EnrolleeDto ): Enrollee {

    const output: Enrollee = this.fromBasePersonTransferObject<Enrollee>( dto, Enrollee );
    console.log( 'fromEnrolleeTranferObject: ', output );

    output.relationship = dto.relationship;
    output.status = dto.status;
    output.currentActivity = dto.currentActivity;

    output.hasNameChange = dto.hasNameChange;
    this.copyDocuments( dto.nameChangeDocs, output.nameChangeDocs );

    // Moving information
    output.madePermanentMoveToBC = dto.madePermanentMoveToBC;
    output.livedInBCSinceBirth = dto.livedInBCSinceBirth;

    return output;
  }

  private toEnrolleeTranferObject( input: Enrollee ): EnrolleeDto {

    const dto: EnrolleeDto = this.toBasePersonTransferObject<EnrolleeDto>( input, EnrolleeDto );
    console.log( 'toEnrolleeTranferObject: ', dto );

    dto.relationship = input.relationship;
    dto.status = input.status;
    dto.currentActivity = input.currentActivity;

    dto.hasNameChange = input.hasNameChange;
    this.copyDocuments( input.nameChangeDocs, dto.nameChangeDocs );

    // Moving information
    dto.madePermanentMoveToBC = input.madePermanentMoveToBC;
    dto.livedInBCSinceBirth = input.livedInBCSinceBirth;

    return dto;
  }
}
