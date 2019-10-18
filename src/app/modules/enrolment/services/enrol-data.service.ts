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

  constructor( protected localStorageService: LocalStorageService ) {
    super( localStorageService );

    // Storage key for enrolment pages
    this._pageStorageKey = 'msp-enrol-pages';

    this.application = this.fetchApplication();
   }

  // Saving Enrolment data into local storage
  saveApplication(): void {
    console.log( 'saveApplication (enrolment)' );
    const dto: EnrolApplicationDto = this.toTransferObject( this.application );
    this.localStorageService.set( this._storageKey, dto);
  }

  // Remove Enrolment data from local storage
  removeApplication(): void {
    console.log( 'removeApplication (enrolment)' );
    this.destroyAll();
    this.application = new EnrolApplication();
  }


  // TODO: Build
  private toTransferObject( input: EnrolApplication ): EnrolApplicationDto {

    const dto: EnrolApplicationDto = new EnrolApplicationDto();
    dto.applicant = this.toEnrolleeTranferObject( input.applicant );

   return dto;
  }

  private fromTransferObject( dto: EnrolApplicationDto ): EnrolApplication {

    const output: EnrolApplication = new EnrolApplication();
    output.applicant = this.fromEnrolleeTranferObject( dto.applicant );

    return output;
  }

  /** Retrieve data from storage */
  private fetchApplication(): EnrolApplication {

    console.log( 'fetchApplication (enrolment)' );
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

    return output;
  }

  private toEnrolleeTranferObject( input: Enrollee ): EnrolleeDto {

    const dto: EnrolleeDto = this.toBasePersonTransferObject<EnrolleeDto>( input, EnrolleeDto );
    dto.relationship = input.relationship;
    dto.status = input.status;
    dto.currentActivity = input.currentActivity;

    return dto;
  }
}
