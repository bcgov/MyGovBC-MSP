import { Injectable } from '@angular/core';
import { BaseMspDataService } from '../../../services/base-msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { AclApplication } from '../model/acl-application.model';
import { AclDto } from '../model/acl.dto';
import { EnrolmentMembership } from '../model/enrolment-membership.enum';

@Injectable({
  providedIn: 'root'
})
export class AclDataService extends BaseMspDataService {

  protected _storageKey: string = 'acl-app'; // TODO: set back to account-letter when original files removed

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
    const dto: AclDto = new AclDto();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;
    dto.accountHolderPhn = input.accountHolderPhn;

    // Date exists convert date to milliseconds since January 1, 1970, 00:00:00 UTC

    dto.accountHolderDob = input.accountHolderDob ? Date.parse( input.accountHolderDob.toString() ) : undefined;

    dto.postalCode = input.postalCode;
    dto.enrolmentMembership = input.enrolmentMembership;

    if ( input.enrolmentMembership === EnrolmentMembership.SpecificMember ) {
      dto.specificMemberPhn = input.specificMemberPhn;
    }
    return dto;
  }


   private fromTransferObject( dto: AclDto ): AclApplication {
    const output: AclApplication = new AclApplication();

    output.infoCollectionAgreement = dto.infoCollectionAgreement;
    output.accountHolderPhn = dto.accountHolderPhn;

    output.accountHolderDob = isNaN( dto.accountHolderDob ) ? undefined : new Date( dto.accountHolderDob );
  
    output.postalCode = dto.postalCode;
    output.enrolmentMembership = dto.enrolmentMembership;
    output.specificMemberPhn = dto.specificMemberPhn;

    return output;
  }

   private fetchApplication(): AclApplication {
    const dto: AclDto = this.localStorageService.get<AclDto>( this._storageKey );

    if ( dto ) {
      return this.fromTransferObject( dto );
    } else {
      return new AclApplication();
    }
  }

}
