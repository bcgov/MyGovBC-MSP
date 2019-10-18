import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import BasePersonDto, { BasePerson } from '../models/base-person';
import BaseApplicationDto, { BaseApplication } from '../models/base-application';
import { SupportDocuments } from '../modules/msp-core/models/support-documents.model';

export default class MspPagesDto {
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
    console.log( 'savePageStatus: ', this._pageStorageKey, dto );
    this.localStorageService.set( this._pageStorageKey, dto );
  }

  protected fetchPageStatus(): any[] {
    let pageStatus: any[] = [];
    const dto: MspPagesDto = this.localStorageService.get<MspPagesDto>( this._pageStorageKey );
    console.log( 'fetchPageStatus: ', this._pageStorageKey, dto );
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

    output.gender = dto.gender;

    this.copyDocuments( dto.documents, output.documents );

    output.dateOfBirth = output.convertToSimpleDt( dto.dateOfBirth  );

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

    dto.gender = input.gender;

    this.copyDocuments( input.documents, dto.documents );
    console.log( 'toBasePersonTransferObject copy: ', dto.documents );

    dto.dateOfBirth = input.convertToDate( input.dateOfBirth );

    return dto;
  }

  protected toBaseApplicationTransferObject<T extends BaseApplicationDto>( input: BaseApplication, c: {new(): T; } ): T {
    const dto = new c();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;

    // Authorization
    dto.authorizedByApplicant = input.authorizedByApplicant;
    dto.authorizedBySpouse = input.authorizedBySpouse;
    dto.authorizedByApplicantDate = input.authorizedByApplicantDate;

    return dto;
  }

  protected fromBaseApplicationTransferObject<T extends BaseApplication>( dto: BaseApplicationDto, c: {new(): T; } ): T {
    const output = new c();

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    // Authorization
    output.authorizedByApplicant = dto.authorizedByApplicant;
    output.authorizedBySpouse = dto.authorizedBySpouse;
    output.authorizedByApplicantDate = dto.authorizedByApplicantDate;

    return output;
  }

  protected copyDocuments( from: SupportDocuments, to: SupportDocuments ) {
    console.log( '1 copyDocuments ', to, from );
    to.documentType = from.documentType;
    to.images = from.images;
    console.log( '2 copyDocuments ', to, from );
  }
}

