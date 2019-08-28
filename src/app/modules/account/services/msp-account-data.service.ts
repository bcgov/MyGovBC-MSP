import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';import {
  MspAccountApp,
  MspPerson
} from '../../../modules/account/models/account.model';
import { Process } from '../../../services/process.service';
import { MspProgressBarItem } from '../../../modules/account/components/progressBar/progressBarDataItem.model';
import MspAccountDto from '../../../modules/account/models/account.dto';
import {
  Gender,
  OperationActionType
} from '../../../components/msp/model/msp-person.model';
import { Address, CANADA, BRITISH_COLUMBIA } from 'moh-common-lib';
import PersonDto from '../../../components/msp/model/msp-person.dto';
import { OutofBCRecord } from '../../../models/outof-bc-record.model';
import { OutofBCRecordDto } from '../../../models/outof-bc-record.dto';
import AddressDto from '../../../components/msp/model/address.dto';

@Injectable()
export class MspAccountMaintenanceDataService {
  
  private _mspAccountApp: MspAccountApp;
  private mspProgressBarKey: string = 'msp-progressbar'; //Progress bar has to be saved since its dynamic .Storing to avoid extra calls in all the getter invocations

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

  getMspProgressBar(): Array<MspProgressBarItem> {
    return this.localStorageService.get<Array<MspProgressBarItem>>(
      this.mspProgressBarKey
    );
  }

  seMspProgressBar(progressBar: Array<MspProgressBarItem>) {
    this.localStorageService.set(this.mspProgressBarKey, progressBar);
  }

  emptyMspProgressBar() {
    this.localStorageService.remove(this.mspProgressBarKey);
  }


  getMspAccountApp(): MspAccountApp {
    return this._mspAccountApp;
  }

  
  saveMspAccountApp(): void {
    const dto: MspAccountDto = this.toMspAccountAppTransferObject(
      this._mspAccountApp
    );
    this.localStorageService.set(this.mspAccountStorageKey, dto);
  }

  private fetchMspAccountApplication(): MspAccountApp {
    const dto: MspAccountDto = this.localStorageService.get<MspAccountDto>(
      this.mspAccountStorageKey
    );
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
    mspAccountApp.applicant.dob_day = 1;
    mspAccountApp.applicant.dob_month = 1;
    mspAccountApp.applicant.dob_year = 2000;
    mspAccountApp.applicant.previous_phn = '1234567890';
    mspAccountApp.phoneNumber = '2501234567';
    const dumyAddress: Address = new Address();
    dumyAddress.street = 'NA';
    mspAccountApp.authorizedByApplicant = true;
    mspAccountApp.authorizedByApplicantDate = new Date();
    // mspAccountApp.applicant.residentialAddress = dumyAddress;
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

    dto.id = input.id;
    dto.relationship = input.relationship;
    dto.liveInBC = input.liveInBC;
    dto.madePermanentMoveToBC = input.madePermanentMoveToBC;
    dto.plannedAbsence = input.plannedAbsence;

    dto.livedInBCSinceBirth = input.livedInBCSinceBirth;
    dto.hasPreviousBCPhn = input.hasPreviousBCPhn;

    dto.firstName = input.firstName;
    dto.middleName = input.middleName;
    dto.lastName = input.lastName;
    dto.dob_day = input.dob_day;
    dto.dob_month = input.dob_month;
    dto.dob_year = input.dob_year;
    dto.middleName = input.middleName;
    dto.previous_phn = input.previous_phn;
    dto.healthNumberFromOtherProvince = input.healthNumberFromOtherProvince;

    dto.arrivalToCanadaDay = input.arrivalToCanadaDay;
    dto.arrivalToCanadaMonth = input.arrivalToCanadaMonth;
    dto.arrivalToCanadaYear = input.arrivalToCanadaYear;
    dto.arrivalToBCDay = input.arrivalToBCDay;
    dto.arrivalToBCMonth = input.arrivalToBCMonth;
    dto.arrivalToBCYear = input.arrivalToBCYear;
    dto.hasBeenReleasedFromArmedForces = input.hasBeenReleasedFromArmedForces;
    dto.movedFromProvinceOrCountry = input.movedFromProvinceOrCountry;
    dto.institutionWorkHistory = input.institutionWorkHistory;
    dto.dischargeYear = input.dischargeYear;
    dto.dischargeMonth = input.dischargeMonth;
    dto.dischargeDay = input.dischargeDay;

    dto.fullTimeStudent = input.fullTimeStudent;
    dto.inBCafterStudies = input.inBCafterStudies;

    dto.schoolName = input.schoolName;

    dto.studiesDepartureYear = input.studiesDepartureYear;
    dto.studiesDepartureMonth = input.studiesDepartureMonth;
    dto.studiesDepartureDay = input.studiesDepartureDay;

    dto.studiesFinishedYear = input.studiesFinishedYear;
    dto.studiesFinishedMonth = input.studiesFinishedMonth;
    dto.studiesFinishedDay = input.studiesFinishedDay;

    dto.studiesBeginYear = input.studiesBeginYear;
    dto.studiesBeginMonth = input.studiesBeginMonth;
    dto.studiesBeginDay = input.studiesBeginDay;

    dto.schoolOutsideOfBC = input.schoolOutsideOfBC;

    dto.declarationForOutsideOver30Days = input.declarationForOutsideOver30Days;

    dto.reasonForCancellation = input.reasonForCancellation;
    dto.cancellationDate = input.cancellationDate;
    dto.isExistingBeneficiary = input.isExistingBeneficiary;
    dto.knownMailingAddress = input.knownMailingAddress;
    dto.nameOfInstitute = input.nameOfInstitute;

    dto.prevLastName = input.prevLastName;
    dto.newlyAdopted = input.newlyAdopted;
    dto.adoptedDate = input.adoptedDate;
    dto.marriageDate = input.marriageDate;

    dto.phoneNumber = input.phoneNumber;
    if (input.mailingAddress.isValid) {
      this.convertMailingAddress(input, dto);
    }
    if (input.residentialAddress.isValid) {
      this.convertResidentialAddress(input, dto);
    }

    if (input.gender) {
      dto.gender = input.gender.valueOf();
    }
    dto.status = input.status;
    dto.currentActivity = input.currentActivity;

    dto.images = input.documents.images;
    return dto;
  }

  private fromPersonDtoForAccount(dto: PersonDto): MspPerson {
    const output: MspPerson = new MspPerson(dto.relationship);

    output.id = dto.id;
    output.liveInBC = dto.liveInBC;
    output.madePermanentMoveToBC = dto.madePermanentMoveToBC;
    output.livedInBCSinceBirth = dto.livedInBCSinceBirth;
    output.hasPreviousBCPhn = dto.hasPreviousBCPhn;

    output.plannedAbsence = dto.plannedAbsence;
    output.firstName = dto.firstName;
    output.middleName = dto.middleName;
    output.lastName = dto.lastName;
    output.dob_day = dto.dob_day;
    output.dob_month = dto.dob_month;
    output.dob_year = dto.dob_year;
    output.middleName = dto.middleName;
    output.healthNumberFromOtherProvince = dto.healthNumberFromOtherProvince;
    output.previous_phn = dto.previous_phn;

    output.arrivalToCanadaDay = dto.arrivalToCanadaDay;
    output.arrivalToCanadaMonth = dto.arrivalToCanadaMonth;
    output.arrivalToCanadaYear = dto.arrivalToCanadaYear;
    output.arrivalToBCDay = dto.arrivalToBCDay;
    output.arrivalToBCMonth = dto.arrivalToBCMonth;
    output.arrivalToBCYear = dto.arrivalToBCYear;

    output.movedFromProvinceOrCountry = dto.movedFromProvinceOrCountry;
    output.hasBeenReleasedFromArmedForces = dto.hasBeenReleasedFromArmedForces;
    output.institutionWorkHistory = dto.institutionWorkHistory;
    output.dischargeYear = dto.dischargeYear;
    output.dischargeMonth = dto.dischargeMonth;
    output.dischargeDay = dto.dischargeDay;

    output.fullTimeStudent = dto.fullTimeStudent;
    output.inBCafterStudies = dto.inBCafterStudies;

    output.schoolName = dto.schoolName;

    output.studiesDepartureYear = dto.studiesDepartureYear;
    output.studiesDepartureMonth = dto.studiesDepartureMonth;
    output.studiesDepartureDay = dto.studiesDepartureDay;

    output.studiesFinishedYear = dto.studiesFinishedYear;
    output.studiesFinishedMonth = dto.studiesFinishedMonth;
    output.studiesFinishedDay = dto.studiesFinishedDay;

    output.studiesBeginYear = dto.studiesBeginYear;
    output.studiesBeginMonth = dto.studiesBeginMonth;
    output.studiesBeginDay = dto.studiesBeginDay;

    output.schoolOutsideOfBC = dto.schoolOutsideOfBC;

    output.declarationForOutsideOver30Days =
      dto.declarationForOutsideOver30Days;

    output.newlyAdopted = dto.newlyAdopted;
    output.adoptedDate = dto.adoptedDate;

    output.reasonForCancellation = dto.reasonForCancellation;
    output.prevLastName = dto.prevLastName;
    output.isExistingBeneficiary = dto.isExistingBeneficiary;
    output.marriageDate = dto.marriageDate;
    output.knownMailingAddress = dto.knownMailingAddress;

    output.phoneNumber = dto.phoneNumber;

    output.cancellationDate = dto.cancellationDate;
    if (dto.gender) {
      output.gender = dto.gender;
    }
    output.status = dto.status;
    output.currentActivity = dto.currentActivity;

    if (this.isValidAddress(dto.mailingAddress)) {
      this.convertMailingAddress(dto, output);
    }
    if (this.isValidAddress(dto.residentialAddress)) {
      this.convertResidentialAddress(dto, output);
    }
    dto.images.forEach(img => {
      output.documents.images = [...output.documents.images, img];
    });

    return output;
  }


  toMspAccountAppTransferObject(input: MspAccountApp): MspAccountDto {
    const dto: MspAccountDto = new MspAccountDto();
    dto.addressUpdate = input.accountChangeOptions.addressUpdate;
    dto.personInfoUpdate = input.accountChangeOptions.personInfoUpdate;
    dto.nameChangeDueToMarriage =
      input.accountChangeOptions.nameChangeDueToMarriage;
    dto.dependentChange = input.accountChangeOptions.dependentChange;
    dto.statusUpdate = input.accountChangeOptions.statusUpdate;
    dto.applicant = this.toPersonDtoForAccount(input.applicant);
    if (input.updatedSpouse) {
      dto.applicant.updatedSpouse = this.toPersonDtoForAccount(
        input.updatedSpouse
      );
    }
    if (input.addedSpouse) {
      dto.applicant.addedSpouse = this.toPersonDtoForAccount(input.addedSpouse);
      dto.applicant.addedSpouse.outOfBCRecord = this.toOutofBCRecordDto(
        input.addedSpouse.outOfBCRecord
      );
      dto.applicant.addedSpouse.planOnBeingOutOfBCRecord = this.toOutofBCRecordDto(
        input.addedSpouse.planOnBeingOutOfBCRecord
      );
    }
    if (input.removedSpouse) {
      dto.applicant.removedSpouse = this.toPersonDtoForAccount(
        input.removedSpouse
      );
    }

    input.addedChildren.forEach(c => {
      const c2: PersonDto = this.toPersonDtoForAccount(c);
      c2.outOfBCRecord = this.toOutofBCRecordDto(c.outOfBCRecord);
      c2.planOnBeingOutOfBCRecord = this.toOutofBCRecordDto(
        c.planOnBeingOutOfBCRecord
      );
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
    dto.infoCollectionAgreement = input.infoCollectionAgreement;

    return dto;
  }

  
  private toOutofBCRecordDto(outofBCRecord: OutofBCRecord) {
    if (outofBCRecord == null) return null;

    const dto: OutofBCRecordDto = new OutofBCRecordDto();
    dto.reason = outofBCRecord.reason;
    dto.location = outofBCRecord.location;
    dto.departureDay = outofBCRecord.departureDay;
    dto.departureMonth = outofBCRecord.departureMonth;
    dto.departureYear = outofBCRecord.departureYear;
    dto.returnDay = outofBCRecord.returnDay;
    dto.returnMonth = outofBCRecord.returnMonth;
    dto.returnYear = outofBCRecord.returnYear;

    return dto;
  }

  private toOutofBCRecord(dto: OutofBCRecordDto) {
    if (dto == null) return null;

    const rec: OutofBCRecord = new OutofBCRecord();
    rec.reason = dto.reason;
    rec.location = dto.location;
    rec.departureDay = dto.departureDay;
    rec.departureMonth = dto.departureMonth;
    rec.departureYear = dto.departureYear;
    rec.returnDay = dto.returnDay;
    rec.returnMonth = dto.returnMonth;
    rec.returnYear = dto.returnYear;

    return rec;
  }

  private fromMspAccountTransferObject(dto: MspAccountDto): MspAccountApp {
    const output: MspAccountApp = new MspAccountApp();

    output.accountChangeOptions.addressUpdate = dto.addressUpdate;
    output.accountChangeOptions.personInfoUpdate = dto.personInfoUpdate;
    output.accountChangeOptions.dependentChange = dto.dependentChange;
    output.accountChangeOptions.statusUpdate = dto.statusUpdate;
    output.accountChangeOptions.nameChangeDueToMarriage =
      dto.nameChangeDueToMarriage;

    output.authorizedByApplicant = dto.authorizedByApplicant;
    output.authorizedByApplicantDate = dto.authorizedByApplicantDate;
    output.authorizedBySpouse = dto.authorizedBySpouse;

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    /*
        output.phoneNumber = dto.phoneNumber;

        this.convertMailingAddress(dto, output);
        this.convertResidentialAddress(dto, output);
*/

    output.applicant = this.fromPersonDtoForAccount(dto.applicant);

    //if page is refreshed before filling address, the province and country is lost..so initialising..
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
  /**
   * Convert data model object to data transfer object that is suitable for client
   * side storage (local or session storage)
   *
   * For financial assistance application.
   */

  /**
   * Convert DTO object from local storage to data model object that is bound to screen.
   * For financial assistance application
   */
  

  convertToPersonDto(input: MspPerson, output: PersonDto) {
    output.dob_day = input.dob_day;
    output.dob_month = input.dob_month;
    output.dob_year = input.dob_year;

    output.firstName = input.firstName;
    output.middleName = input.middleName;
    output.lastName = input.lastName;

    output.sin = input.sin;
    output.previous_phn = input.previous_phn;
    output.liveInBC = input.liveInBC;
    output.madePermanentMoveToBC = input.madePermanentMoveToBC;
    output.plannedAbsence = input.plannedAbsence;
    output.assistYearDocs = input.assistYearDocs;
  }

  convertToPerson(input: PersonDto, output: MspPerson) {
    output.dob_day = input.dob_day;
    output.dob_month = input.dob_month;
    output.dob_year = input.dob_year;

    output.firstName = input.firstName;
    output.middleName = input.middleName;
    output.lastName = input.lastName;
    output.assistYearDocs = input.assistYearDocs;
    output.sin = input.sin;
    output.previous_phn = input.previous_phn;
    output.liveInBC = input.liveInBC;
    output.madePermanentMoveToBC = input.madePermanentMoveToBC;
    output.plannedAbsence = input.plannedAbsence;
  }
}
