import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import BasePersonDto, { BasePerson } from '../models/base-person';

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
    console.log( 'fromBasePersonTransferObject: ', output );

    output.firstName = dto.firstName;
    output.middleName = dto.middleName;
    output.lastName = dto.lastName;

    output.gender = dto.gender;

    output.documents = dto.documents;

    if ( dto.dateOfBirth ) {
      // TODO: revisit once date component refactored
      output.dateOfBirth = {
        year: dto.dateOfBirth.getFullYear(),
        month: dto.dateOfBirth.getMonth(),
        day: dto.dateOfBirth.getDate()
      };
    }

    return output;
  }

  /**
   * Copies data from class to storage object
   * @param input data to be copied to new instance of storage object
   * @param c storage object to create
   */
  protected toBasePersonTransferObject<T extends BasePersonDto>( input: BasePerson, c: {new(): T; } ): T {

    const dto = new c();
    console.log( 'toBasePersonTransferObject: ', dto );

    dto.firstName = input.firstName;
    dto.middleName = input.middleName;
    dto.lastName = input.lastName;

    dto.gender = input.gender;

    dto.documents = input.documents;

    if ( !input.isDobEmpty() ) {
      // TODO: revisit once date component refactored
      dto.dateOfBirth = new Date( input.dateOfBirth.year, input.dateOfBirth.month - 1, input.dateOfBirth.day );
    }

    return dto;
  }
}

