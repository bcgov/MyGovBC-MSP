import { Injectable } from '@angular/core';
import { BaseMspDataService } from '../../../services/base-msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { AclApplication } from '../model/acl-application.model';
import AclDto from '../model/acl.dto';
import { EnrolmentMembership } from '../model/enrolment-membership.enum';

@Injectable({
  providedIn: 'root'
})
export class AclDataService extends BaseMspDataService {

  private _storageKey: string = 'acl-app'; // TODO: set back to account-letter when original files removed

  application: AclApplication;

  constructor( protected localStorageService: LocalStorageService ) {
    super( localStorageService );
    this.application = this.fetchApplication();
   }

  // Saving Account Letter into local storage
  saveApplication(): void {
    const dto: AclDto = this.toTransferObject( this.application );
    this.localStorageService.set( this._storageKey, dto );
  }

  // Remove Account Letter from local storage
  removeApplication(): void {
    this.destroyAll();
    this.application = new AclApplication();
  }

  private toTransferObject( input: AclApplication ): AclDto {

    console.log( 'to transfer object: ', input );
    const dto: AclDto = new AclDto();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;
    dto.accountHolderPhn = input.accountHolderPhn;
    dto.accountHolderDob = input.accountHolderDob;
    dto.postalCode = input.postalCode;
    dto.enrolmentMembership = input.enrolmentMembership;

    if ( input.enrolmentMembership === EnrolmentMembership.SpecificMember ) {
      dto.specificMemberPhn = input.specificMemberPhn;
    }
    return dto;
  }


   private fromTransferObject( dto: AclDto ): AclApplication {
    const output: AclApplication = new AclApplication();

    console.log( 'from transfer object: ', dto );

    output.infoCollectionAgreement = dto.infoCollectionAgreement;
    output.accountHolderPhn = dto.accountHolderPhn;
    output.accountHolderDob = dto.accountHolderDob;
    output.postalCode = dto.postalCode;
    output.enrolmentMembership = dto.enrolmentMembership;
    output.specificMemberPhn = dto.specificMemberPhn;

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
