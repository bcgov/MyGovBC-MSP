import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BasePersonDto, BasePerson } from '../models/base-person';
import { BaseApplicationDto, BaseApplication } from '../models/base-application';
import { SupportDocumentsDto, SupportDocuments } from '../modules/msp-core/models/support-documents.model';
import { AddressDto } from '../models/address.dto';
import { Address, CommonImage } from 'moh-common-lib';
import { CommonImageDto } from '../models/common-image.dto';

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
    
    const transferredImgs: CommonImageDto[] = [];
    
    // Convert each CommonImage to storable dto
    for (const img of input.images) {
      transferredImgs.push(this.toCommonImageTransferObject(img));
    }
    
    dto.images = transferredImgs;

    return dto;
  }

  protected fromSupportDocumentTransferObject( dto: SupportDocumentsDto ): SupportDocuments {
    const output = new SupportDocuments();

    output.documentType = dto.documentType;

    const transferredImgs: CommonImage[] = [];
    
    // Convert each image from stored dto to CommonImage
    for (const img of dto.images) {
      transferredImgs.push(this.fromCommonImageTransferObject(img));
    }

    output.images = transferredImgs;

    return output;
  }

  protected toCommonImageTransferObject(input: CommonImage): CommonImageDto {
    const dto = new CommonImageDto();

    dto.uuid = input.uuid;
    dto.fileContent = input.fileContent;
    dto.documentType = input.documentType;
    dto.contentType = input.contentType;
    dto.size = input.size;
    dto.sizeUnit = input.sizeUnit;
    dto.sizeTxt = input.sizeTxt;
    dto.naturalHeight = input.naturalHeight;
    dto.naturalWidth = input.naturalWidth;
    dto.name = input.name;
    dto.id = input.id;
    dto.attachmentOrder = input.attachmentOrder;
    
    if (input.error) {
      dto.error = input.error;
    }

    return dto;
  }

  protected fromCommonImageTransferObject(dto: CommonImageDto): CommonImage {
    const output = new CommonImage();

    output.uuid = dto.uuid;
    output.fileContent = dto.fileContent;
    output.documentType = dto.documentType;
    output.contentType = dto.contentType;
    output.size = dto.size;
    output.sizeUnit = dto.sizeUnit;
    output.sizeTxt = dto.sizeTxt;
    output.naturalHeight = dto.naturalHeight;
    output.naturalWidth = dto.naturalWidth;
    output.name = dto.name;
    output.id = dto.id;
    output.attachmentOrder = dto.attachmentOrder;
    
    if (dto.error) {
      output.error = dto.error;
    }

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

