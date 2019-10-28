import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BasePersonDto, BasePerson } from '../models/base-person';
import { BaseApplicationDto, BaseApplication } from '../models/base-application';
import { SupportDocumentsDto, SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import { AddressDto } from '../models/address.dto';
import { Address } from 'moh-common-lib';

export class MspPagesDto {
  // page status - complete/ incomplete
  pageStatus: any[] = [];
}

@Injectable({
  providedIn: 'root'
})
export abstract class BaseMspDataService {

  // Set key for page status storage
  protected  _pageStorageKey: string = 'msp-pages';

  // Application storage key set in derived service
  protected abstract _storageKey: string;

  constructor( protected localStorageService: LocalStorageService ) { }

  abstract saveApplication(): void;
  abstract removeApplication(): void;


  /** Storage methods */
  protected destroyAll() {
    this.localStorageService.clearAll();
  }

  /** Method to save page statuses */
  protected savePageStatus( pageStatus: any[] ): void {
    const dto: MspPagesDto = new MspPagesDto();
    dto.pageStatus = pageStatus;
    this.localStorageService.set( this._pageStorageKey, dto );
  }

  protected fetchPageStatus(): any[] {
    let pageStatus: any[] = [];
    const dto: MspPagesDto = this.localStorageService.get<MspPagesDto>( this._pageStorageKey );
    if ( dto ) {
      pageStatus = dto.pageStatus;
    }
    return pageStatus;
  }

  /**
   * Copies data from storage object to class
   * @param dto data to be copied to new instance of class
   * @param c class to create
   */
  protected fromBasePersonTransferObject<T extends BasePerson>( dto: BasePersonDto, c: {new(): T; } ): T {

    const output = new c();

    output.firstName = dto.firstName;
    output.middleName = dto.middleName;
    output.lastName = dto.lastName;

    output.relationship = dto.relationship;
    output.gender = dto.gender;
    output.dateOfBirth = this.convertNumberToDate( dto.dateOfBirth );

    output.documents = this.fromSupportDocumentTransferObject( dto.documents );

    return output;
  }

  /**
   * Copies data from class to storage object
   * @param input data to be copied to new instance of storage object
   * @param c storage object to create
   */
  protected toBasePersonTransferObject<T extends BasePersonDto>( input: BasePerson, c: {new(): T; } ): T {

    const dto = new c();

    dto.firstName = input.firstName;
    dto.middleName = input.middleName;
    dto.lastName = input.lastName;

    dto.relationship = input.relationship;
    dto.gender = input.gender;
    dto.dateOfBirth = this.convertDateToNumber( input.dateOfBirth );

    // SupportDocuments
    dto.documents = this.toSupportDocumentTransferObject( input.documents );

    return dto;
  }

  protected toBaseApplicationTransferObject<T extends BaseApplicationDto>( input: BaseApplication, c: {new(): T; } ): T {
    const dto = new c();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;

    // Authorization
    dto.authorizedByApplicant = input.authorizedByApplicant;
    dto.authorizedBySpouse = input.authorizedBySpouse;
    dto.authorizedByApplicantDate = this.convertDateToNumber( input.authorizedByApplicantDate );

    return dto;
  }

  protected fromBaseApplicationTransferObject<T extends BaseApplication>( dto: BaseApplicationDto, c: {new(): T; } ): T {
    const output = new c();

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    // Authorization
    output.authorizedByApplicant = dto.authorizedByApplicant;
    output.authorizedBySpouse = dto.authorizedBySpouse;
    output.authorizedByApplicantDate = this.convertNumberToDate( dto.authorizedByApplicantDate );

    return output;
  }

  protected toAddressTransferObject( input: Address ): AddressDto {
    const dto = new AddressDto();

    dto.addressLine1 = input.addressLine1;
    dto.addressLine2 = input.addressLine2;
    dto.addressLine3 = input.addressLine3;

    dto.city = input.city;
    dto.province = input.province;
    dto.country = input.country;
    dto.postal = input.postal;

    return dto;
  }

  protected fromAddressTransferObject( dto: AddressDto ): Address {
    const output = new Address();

    output.addressLine1 = dto.addressLine1;
    output.addressLine2 = dto.addressLine2;
    output.addressLine3 = dto.addressLine3;

    output.city = dto.city;
    output.province = dto.province;
    output.country = dto.country;
    output.postal = dto.postal;

    return output;
  }

  protected toSupportDocumentTransferObject( input: SupportDocuments ): SupportDocumentsDto {
    const dto = new SupportDocumentsDto();

    dto.documentType = input.documentType;
    dto.images = input.images;
    return dto;
  }

  protected fromSupportDocumentTransferObject( dto: SupportDocumentsDto ): SupportDocuments {
    const output = new SupportDocuments();

    output.documentType = dto.documentType;
    output.images = dto.images;
    return output;
  }

  /**
   * Converts date object to number
   * @param dt Date
   */
  protected convertDateToNumber( dt: Date ): number {
    // Date exists convert date to milliseconds since January 1, 1970, 00:00:00 UTC
    if ( dt ) {
      return Date.parse( dt.toString() );
    }
    return undefined;
  }

  /**
   * Converts number to Date object
   * @param dtInMsec Time in milliseconds since January 1, 1970, 00:00:00 UTC
   */
  protected convertNumberToDate( dtInMsec: number ): Date {
    return isNaN( dtInMsec ) ? undefined : new Date( dtInMsec );
  }
}

