import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { MspAccountApp } from '../../../modules/account/models/account.model';
import { Process } from '../../../services/process.service';
import { MspAccountDto } from '../../../modules/account/models/account.dto';
import {
  OperationActionType,
  MspPerson
} from '../../../components/msp/model/msp-person.model';
import { Address, CANADA, BRITISH_COLUMBIA } from 'moh-common-lib';
import { PersonDto } from '../../../components/msp/model/msp-person.dto';
import { OutofBCRecordDto, OutofBCRecord } from '../../../models/outof-bc-record.model';
import { AddressDto } from '../../../models/address.dto';
import { Gender } from '../../../models/gender.enum';

@Injectable()
export class MspAccountMaintenanceDataService {

  private _mspAccountApp: MspAccountApp;
  private mspAccountStorageKey: string = 'msp-account';

  constructor(public localStorageService: LocalStorageService) {
    this._mspAccountApp = this.fetchMspAccountApplication();
  }

  get accountApp(): MspAccountApp {
    return this._mspAccountApp;
  }

  destroyAll() {
    this.localStorageService.clearAll();
  }

  getMspAccountMaintenance(): Process {
    return this.localStorageService.get<Process>(this.mspAccountStorageKey);
  }

  setMspAccountMaintenance(process: Process) {
    this.localStorageService.set(this.mspAccountStorageKey, process);
  }

  getMspAccountApp(): MspAccountApp {
    return this._mspAccountApp;
  }

  saveMspAccountApp(): void {
    const dto: MspAccountDto = this.toMspAccountAppTransferObject(this._mspAccountApp);
    this.localStorageService.set(this.mspAccountStorageKey, dto);
  }

  private fetchMspAccountApplication(): MspAccountApp {
    const dto: MspAccountDto = this.localStorageService.get<MspAccountDto>(this.mspAccountStorageKey);
    if (dto) {
      return this.fromMspAccountTransferObject(dto);
    } else {
      return new MspAccountApp();
    }
  }

  public getFakeAccountChangeApplication(): MspAccountApp {
    const mspAccountApp: MspAccountApp = this._mspAccountApp;
    mspAccountApp.accountChangeOptions.addressUpdate = true;
    mspAccountApp.applicant.firstName = 'NA';
    mspAccountApp.applicant.lastName = 'NA';
    mspAccountApp.applicant.gender = Gender.Male;
    mspAccountApp.applicant.dob = new Date( 2000, 1, 1);
    mspAccountApp.applicant.previous_phn = '1234567890';
    mspAccountApp.phoneNumber = '2501234567';
    const dummyAddress: Address = new Address();
    dummyAddress.street = 'NA';
    mspAccountApp.authorizedByApplicant = true;
    mspAccountApp.authorizedByApplicantDate = new Date();
    // mspAccountApp.applicant.residentialAddress = dummyAddress;
    return mspAccountApp;
  }

  convertMailingAddress(input: any, output: any) {
    this.convertAddress(input, output, 'mailingAddress');
  }

  convertResidentialAddress(input: any, output: any) {
    this.convertAddress(input, output, 'residentialAddress');
  }

  private convertSchoolAddress(input: any, output: any) {
    this.convertAddress(input, output, 'schoolAddress');
  }

  private convertAddress(input: any, output: any, property: string) {
    output[property].street = input[property].street;
    output[property].addressLine1 = input[property].addressLine1;
    output[property].addressLine2 = input[property].addressLine2;
    output[property].addressLine3 = input[property].addressLine3;
    output[property].postal = input[property].postal;
    output[property].city = input[property].city;
    output[property].province = input[property].province;
    output[property].country = input[property].country;
  }

  removeMspAccountApp(): void {
    this.destroyAll();
    this._mspAccountApp = new MspAccountApp();
  }

  private toPersonDtoForAccount(input: MspPerson): PersonDto {
    const dto: PersonDto = new PersonDto();

    dto.transferPrimitives(input, dto);

    if (input.mailingAddress.isValid) {
      this.convertMailingAddress(input, dto);
    }

    if (input.residentialAddress.isValid) {
      this.convertResidentialAddress(input, dto);
    }

    dto.updateStatusInCanadaDoc = input.updateStatusInCanadaDoc;
    dto.updateStatusInCanadaDocType = input.updateStatusInCanadaDocType;

    dto.updateNameDueToMarriageDoc = input.updateNameDueToMarriageDoc;
    dto.updateNameDueToMarriageDocType = input.updateNameDueToMarriageDocType;

    dto.updateNameDueToNameChangeDoc = input.updateNameDueToNameChangeDoc;
    dto.updateNameDueToNameChangeDocType = input.updateNameDueToNameChangeDocType;

    dto.updateNameDueToErrorDoc = input.updateNameDueToErrorDoc;
    dto.updateNameDueToErrorDocType = input.updateNameDueToErrorDocType;

    dto.updateBirthdateDoc = input.updateBirthdateDoc;
    dto.updateBirthdateDocType = input.updateBirthdateDocType;

    dto.updateGenderDoc = input.updateGenderDoc;
    dto.updateGenderDocType = input.updateGenderDocType;

    dto.updateGenderDesignationDoc = input.updateGenderDesignationDoc;
    dto.updateGenderDesignationDocType = input.updateGenderDesignationDocType;

    return dto;
  }

  private fromPersonDtoForAccount(dto: PersonDto): MspPerson {
    const output: MspPerson = new MspPerson(dto.relationship);

    dto.transferPrimitives(dto, output);
    if (this.isValidAddress(dto.mailingAddress)) {
      this.convertMailingAddress(dto, output);
    }

    if (this.isValidAddress(dto.residentialAddress)) {
      this.convertResidentialAddress(dto, output);
    }

    dto.images.forEach(img => {
      output.documents.images = [...output.documents.images, img];
    });

    output.updateStatusInCanadaDoc = dto.updateStatusInCanadaDoc;
    output.updateStatusInCanadaDocType = dto.updateStatusInCanadaDocType;

    output.updateNameDueToMarriageDoc = dto.updateNameDueToMarriageDoc;
    output.updateNameDueToMarriageDocType = dto.updateNameDueToMarriageDocType;

    output.updateNameDueToNameChangeDoc = dto.updateNameDueToNameChangeDoc;
    output.updateNameDueToNameChangeDocType = dto.updateNameDueToNameChangeDocType;

    output.updateNameDueToErrorDoc = dto.updateNameDueToErrorDoc;
    output.updateNameDueToErrorDocType = dto.updateNameDueToErrorDocType;

    output.updateBirthdateDoc = dto.updateBirthdateDoc;
    output.updateBirthdateDocType = dto.updateBirthdateDocType;

    output.updateGenderDoc = dto.updateGenderDoc;
    output.updateGenderDocType = dto.updateGenderDocType;

    output.updateGenderDesignationDoc = dto.updateGenderDesignationDoc;
    output.updateGenderDesignationDocType = dto.updateGenderDesignationDocType;

    return output;
  }

  toMspAccountAppTransferObject(input: MspAccountApp): MspAccountDto {
    const dto: MspAccountDto = new MspAccountDto();
    dto.transferPrimitives(input, dto);

    dto.applicant = this.toPersonDtoForAccount(input.applicant);

    if (input.updatedSpouse) {
      dto.applicant.updatedSpouse = this.toPersonDtoForAccount(input.updatedSpouse);
    }

    if (input.addedSpouse) {
      dto.applicant.addedSpouse = this.toPersonDtoForAccount(input.addedSpouse);
      dto.applicant.addedSpouse.outOfBCRecord = this.toOutofBCRecordDto(input.addedSpouse.outOfBCRecord);
      dto.applicant.addedSpouse.planOnBeingOutOfBCRecord = this.toOutofBCRecordDto(input.addedSpouse.planOnBeingOutOfBCRecord);
    }

    if (input.removedSpouse) {
      dto.applicant.removedSpouse = this.toPersonDtoForAccount(input.removedSpouse);
    }

    input.addedChildren.forEach(c => {
      const c2: PersonDto = this.toPersonDtoForAccount(c);
      c2.outOfBCRecord = this.toOutofBCRecordDto(c.outOfBCRecord);
      c2.planOnBeingOutOfBCRecord = this.toOutofBCRecordDto(c.planOnBeingOutOfBCRecord);
      this.convertSchoolAddress(c, c2);
      dto.applicant.addedChildren = [...dto.applicant.addedChildren, c2];
    });

    input.removedChildren.forEach(c => {
      const c2: PersonDto = this.toPersonDtoForAccount(c);
      c2.outOfBCRecord = this.toOutofBCRecordDto(c.outOfBCRecord);
      this.convertSchoolAddress(c, c2);
      dto.applicant.removedChildren = [...dto.applicant.removedChildren, c2];
    });

    input.updatedChildren.forEach(c => {
      const c2: PersonDto = this.toPersonDtoForAccount(c);
      dto.applicant.updatedChildren = [...dto.applicant.updatedChildren, c2];
    });

    dto.documents = input.documents.sort(
      (a, b) => a.attachmentOrder - b.attachmentOrder
    );

    return dto;
  }

  private toOutofBCRecordDto(outofBCRecord: OutofBCRecord): OutofBCRecordDto {
    if (outofBCRecord == null) return null;
    const dto: OutofBCRecordDto = new OutofBCRecordDto();
    dto.transferPrimitives(outofBCRecord, dto);
    return dto;
  }

  private toOutofBCRecord(dto: OutofBCRecordDto): OutofBCRecord {
    if (dto == null) return null;
    const rec: OutofBCRecord = new OutofBCRecord();
    dto.transferPrimitives(dto, rec);
    return rec;
  }

  private fromMspAccountTransferObject(dto: MspAccountDto): MspAccountApp {
    const output: MspAccountApp = new MspAccountApp();
    dto.transferPrimitives(dto, output);

    output.applicant = this.fromPersonDtoForAccount(dto.applicant);

    //if page is refreshed before filling address, the province and country is lost. Re-initializing.
    if (!output.applicant.residentialAddress.province) {
      output.applicant.residentialAddress.province = BRITISH_COLUMBIA;
    }
    
    if (!output.applicant.residentialAddress.country) {
      output.applicant.residentialAddress.country = CANADA;
    }

    if (dto.applicant.addedSpouse) {
      output.addedSpouse = this.fromPersonDtoForAccount(
        dto.applicant.addedSpouse
      );
      output.addedSpouse.planOnBeingOutOfBCRecord = this.toOutofBCRecord(
        dto.applicant.addedSpouse.planOnBeingOutOfBCRecord
      );
      output.addedSpouse.outOfBCRecord = this.toOutofBCRecord(
        dto.applicant.addedSpouse.outOfBCRecord
      );
      output.addedSpouse.operationActionType = OperationActionType.Add;
    }
    
    if (dto.applicant.updatedSpouse) {
      output.updatedSpouse = this.fromPersonDtoForAccount(
        dto.applicant.updatedSpouse
      );
      output.updatedSpouse.operationActionType = OperationActionType.Update;
    }
    
    if (dto.applicant.removedSpouse) {
      output.removedSpouse = this.fromPersonDtoForAccount(
        dto.applicant.removedSpouse
      );
      output.removedSpouse.operationActionType = OperationActionType.Remove;
    }
    
    dto.applicant.addedChildren.forEach(c => {
      if (c) {
        const child: MspPerson = this.fromPersonDtoForAccount(c);
        child.outOfBCRecord = this.toOutofBCRecord(c.outOfBCRecord);
        child.planOnBeingOutOfBCRecord = this.toOutofBCRecord(
          c.planOnBeingOutOfBCRecord
        );
        child.operationActionType = OperationActionType.Add;
        this.convertSchoolAddress(c, child);

        output.addedChildren = [...output.addedChildren, child];
      }
    });

    dto.applicant.removedChildren.forEach(c => {
      const child: MspPerson = this.fromPersonDtoForAccount(c);
      child.outOfBCRecord = this.toOutofBCRecord(c.outOfBCRecord);
      this.convertSchoolAddress(c, child);
      child.operationActionType = OperationActionType.Remove;
      output.removedChildren = [...output.removedChildren, child];
    });

    dto.applicant.updatedChildren.forEach(c => {
      const child: MspPerson = this.fromPersonDtoForAccount(c);
      child.operationActionType = OperationActionType.Update;
      output.updatedChildren = [...output.updatedChildren, child];
    });

    dto.applicant.updateNameDueToMarriageDoc.forEach(img => {
      output.applicant.updateNameDueToMarriageDoc = [img];
    });

    dto.applicant.updateNameDueToNameChangeDoc.forEach(img => {
      output.applicant.updateNameDueToNameChangeDoc = [img];
    });

    dto.documents.forEach(img => {
      output.documents = [...output.documents, img];
    });

    return output;
  }

  //TODO rewrite and make it proper
  isValidAddress(addressDto: AddressDto): boolean {
    if (addressDto) {
      if (addressDto.addressLine1 && addressDto.addressLine1.length > 0) {
        return true;
      }
    }
    return false;
  }

  convertToPersonDto(input: MspPerson, output: PersonDto) {
    output.transferPrimitives(input, output);
  }

  convertToPerson(input: PersonDto, output: MspPerson) {
    input.transferPrimitives(input, output);
  }
}
