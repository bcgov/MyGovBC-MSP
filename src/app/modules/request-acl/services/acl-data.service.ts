import { Injectable } from '@angular/core';
import { BaseMspDataService } from '../../../services/base-msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { AclApplication } from '../model/acl-application.model';
import AclDto from '../model/acl.dto';

@Injectable({
  providedIn: 'root'
})
export class AclDataService extends BaseMspDataService {

  private _application: AclApplication;
  private _storageKey: string = 'acl-app'; // TODO: set back to account-letter when original files removed

  constructor( protected localStorageService: LocalStorageService ) {
    super( localStorageService );
    this._application = this.fetchApplication();
   }

   get application() {
     return this._application;
   }

  // Saving Account Letter into local storage
  saveApplication(): void {
    const dto: AclDto = this.toTransferObject( this._application );
    this.localStorageService.set( this._storageKey, dto );
  }

  // Remove Account Letter from local storage
  removeApplication(): void {
    this.destroyAll();
    this._application = new AclApplication();
  }

  private toTransferObject( input: AclApplication ): AclDto {

    console.log( 'to transfer object: ', input );
    const dto: AclDto = new AclDto();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;

   // TODO: complete acl-application.model.ts file
   // dto.postalCode = input.postalCode;
   // dto.enrollmentMember = input.applicant.enrollmentMember;

    return dto;
  }


   private fromTransferObject( dto: AclDto ): AclApplication {
    const output: AclApplication = new AclApplication();

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    // TODO: complete acl-application.model.ts file
    // output.postalCode = dto.postalCode;
    // output.applicant.enrollmentMember = dto.enrollmentMember;

    return output;
  }

   private fetchApplication(): AclApplication {
    console.log( 'fetch application (storage key): ', this._storageKey );
    const dto: AclDto = this.localStorageService.get<AclDto>( this._storageKey );
    console.log( 'fetch application (dto): ', dto );
    if ( dto ) {
      return this.fromTransferObject( dto );
    } else {
      return new AclApplication();
    }
  }

}
