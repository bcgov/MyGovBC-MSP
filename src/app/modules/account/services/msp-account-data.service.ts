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
    mspAccountApp.applicant.dob = new Date( 2000, 1, 1);
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
    dto.dob = input.dob;
    dto.middleName = input.middleName;
    dto.previous_phn = input.previous_phn;

    dto.healthNumberFromOtherProvince = input.healthNumberFromOtherProvince;

    dto.hasNameChange = input.hasNameChange;


    //= input.updateNameDueToMarriageDoc;


    dto.arrivalToCanadaDate = input.arrivalToCanadaDate;
    dto.arrivalToBCDate = input.arrivalToBCDate;
    dto.hasBeenReleasedFromArmedForces = input.hasBeenReleasedFromArmedForces;
    dto.movedFromProvinceOrCountry = input.movedFromProvinceOrCountry;
    dto.institutionWorkHistory = input.institutionWorkHistory;
    dto.dischargeDate = input.dischargeDate;

    dto.fullTimeStudent = input.fullTimeStudent;
    dto.inBCafterStudies = input.inBCafterStudies;

    dto.schoolName = input.schoolName;
    dto.studiesDepartureDate = input.studiesDepartureDate;
    dto.studiesFinishedDate = input.studiesFinishedDate;
    dto.studiesBeginDate = input.studiesBeginDate;

    dto.schoolOutsideOfBC = input.schoolOutsideOfBC;

    dto.declarationForOutsideOver30Days = input.declarationForOutsideOver30Days;

    dto.declarationForOutsideOver60Days = input.declarationForOutsideOver60Days;

    dto.reasonForCancellation = input.reasonForCancellation;
    dto.cancellationDate = input.cancellationDate;
    dto.isExistingBeneficiary = input.isExistingBeneficiary;
    dto.knownMailingAddress = input.knownMailingAddress;
    dto.nameOfInstitute = input.nameOfInstitute;

    dto.prevLastName = input.prevLastName;
    dto.newlyAdopted = input.newlyAdopted;
    dto.adoptedDate = input.adoptedDate;

    dto.marriageDate  = input.marriageDate;
   // dto.relationship = input.relationship;


    dto.phoneNumber = input.phoneNumber;
    if (input.mailingAddress.isValid) {
      this.convertMailingAddress(input, dto);
    }
    if (input.residentialAddress.isValid) {
      this.convertResidentialAddress(input, dto);
    }

    if (input.gender) {
      dto.gender = input.gender;
    }
   // dto.docType = input.docType;
    dto.status = input.status;

    dto.currentActivity = input.currentActivity;

    dto.images = input.documents.images;

    dto.updateStatusInCanada = input.updateStatusInCanada;
    dto.updateNameDueToMarriageRequestedLastName = input.updateNameDueToMarriageRequestedLastName;
    dto.updateNameDueToMarriage = input.updateNameDueToMarriage;
    dto.updateNameDueToNameChange = input.updateNameDueToNameChange;
    dto.updateNameDueToError = input.updateNameDueToError;
    dto.updateBirthdate = input.updateBirthdate;
    dto.updateGender = input.updateGender;
    dto.updateGenderDesignation = input.updateGenderDesignation;
    dto.updateStatusInCanadaDocType = input.updateStatusInCanadaDocType;
    dto.updateNameDueToMarriageDocType = input.updateNameDueToMarriageDocType;
    dto.updateNameDueToMarriageDoc = input.updateNameDueToMarriageDoc;
    dto.updateNameDueToNameChangeDocType = input.updateNameDueToNameChangeDocType;
    dto.updateNameDueToNameChangeDoc = input.updateNameDueToNameChangeDoc;
    dto.updateNameDueToErrorDocType = input.updateNameDueToErrorDocType;
    dto.updateNameDueToErrorDoc = input.updateNameDueToErrorDoc;
    dto.nameChangeDocs = input.nameChangeDocs;

    dto.departureReason12Months = input.departureReason12Months;
    dto.departureDestination12Months = input.departureDestination12Months;

    dto.hasActiveMedicalServicePlan = input.hasActiveMedicalServicePlan;

    dto.previouslastName = input.previouslastName;
    dto.updatingPersonalInfo = input.updatingPersonalInfo;

    dto.departureReason = input.departureReason;
    dto.departureDestination = input.departureDestination;

    dto.departureDateDuring12MonthsDate =  input.departureDateDuring12MonthsDate;
    dto.departureDateDuring6MonthsDate = input.departureDateDuring6MonthsDate;
    dto.returnDate12MonthsDate = input.returnDate12MonthsDate ;
    dto.returnDate6MonthsDate = input.returnDate6MonthsDate ;

    dto.immigrationStatusChange = input.immigrationStatusChange;
   // dto.spouseRemoved = input.spouseRemoved;
    dto.cancellationDate = input.cancellationDate;
    dto.cancellationReason = input.cancellationReason;
    dto.hasCurrentMailingAddress = input.hasCurrentMailingAddress;
    dto.removedSpouseDueToDivorceDoc = input.removedSpouseDueToDivorceDoc;

    dto.updateBirthdateDocType = input.updateBirthdateDocType;
    dto.updateBirthdateDoc = input.updateBirthdateDoc;

    dto.isRemovedAtTheEndOfCurrentMonth = input.isRemovedAtTheEndOfCurrentMonth;

    dto.updateGenderDocType = input.updateGenderDocType;
    dto.updateGenderDoc = input.updateGenderDoc;

    dto.updateGenderDesignationDocType = input.updateGenderDesignationDocType;
    dto.updateGenderDesignationDoc = input.updateGenderDesignationDoc;

    dto.updateStatusInCanadaDoc = input.updateStatusInCanadaDoc;

    return dto;
  }

  private fromPersonDtoForAccount(dto: PersonDto): MspPerson {
    const output: MspPerson = new MspPerson(dto.relationship);

    output.id = dto.id;
    output.liveInBC = dto.liveInBC;
    output.madePermanentMoveToBC = dto.madePermanentMoveToBC;
    output.livedInBCSinceBirth = dto.livedInBCSinceBirth;
    output.hasPreviousBCPhn = dto.hasPreviousBCPhn;
   // output.docType = dto.docType;
    output.plannedAbsence = dto.plannedAbsence;
    output.firstName = dto.firstName;
    output.middleName = dto.middleName;
    output.lastName = dto.lastName;
    output.dob = dto.dob;
    output.middleName = dto.middleName;
    output.healthNumberFromOtherProvince = dto.healthNumberFromOtherProvince;
    output.previous_phn = dto.previous_phn;

    output.hasNameChange = dto.hasNameChange;
    output.nameChangeDocs = dto.nameChangeDocs;

    output.relationship = dto.relationship;

    output.previouslastName = dto.previouslastName;

    output.immigrationStatusChange = dto.immigrationStatusChange;
    output.updatingPersonalInfo = dto.updatingPersonalInfo;
    output.departureDestination = dto.departureDestination;

    output.cancellationDate = dto.cancellationDate;
    output.cancellationReason = dto.cancellationReason;
    output.hasCurrentMailingAddress = dto.hasCurrentMailingAddress;
    output.removedSpouseDueToDivorceDoc = dto.removedSpouseDueToDivorceDoc;

    output.isRemovedAtTheEndOfCurrentMonth = dto.isRemovedAtTheEndOfCurrentMonth;

    output.marriageDate  = dto.marriageDate;

    output.hasActiveMedicalServicePlan = dto.hasActiveMedicalServicePlan;

    output.arrivalToCanadaDate = dto.arrivalToCanadaDate;
    output.arrivalToBCDate = dto.arrivalToBCDate;

    output.movedFromProvinceOrCountry = dto.movedFromProvinceOrCountry;
    output.hasBeenReleasedFromArmedForces = dto.hasBeenReleasedFromArmedForces;
    output.institutionWorkHistory = dto.institutionWorkHistory;
    output.dischargeDate = dto.dischargeDate;

    output.fullTimeStudent = dto.fullTimeStudent;
    output.inBCafterStudies = dto.inBCafterStudies;

    output.schoolName = dto.schoolName;
    output.studiesDepartureDate = dto.studiesDepartureDate;
    output.studiesFinishedDate = dto.studiesFinishedDate;
    output.studiesBeginDate = dto.studiesBeginDate;

    output.schoolOutsideOfBC = dto.schoolOutsideOfBC;

    output.declarationForOutsideOver30Days =
      dto.declarationForOutsideOver30Days;

      output.declarationForOutsideOver60Days =
      dto.declarationForOutsideOver60Days;

    output.newlyAdopted = dto.newlyAdopted;
    output.adoptedDate = dto.adoptedDate;

    output.reasonForCancellation = dto.reasonForCancellation;
    output.prevLastName = dto.prevLastName;
    output.isExistingBeneficiary = dto.isExistingBeneficiary;
    output.marriageDate = dto.marriageDate;
    output.knownMailingAddress = dto.knownMailingAddress;




    output.phoneNumber = dto.phoneNumber;

    output.departureReason = dto.departureReason;
    output.departureReason12Months = dto.departureReason12Months;
    output.departureDestination12Months = dto.departureDestination12Months;
    output.departureDateDuring12MonthsDate =  dto.departureDateDuring12MonthsDate;
    output.departureDateDuring6MonthsDate = dto.departureDateDuring6MonthsDate ;

    output.returnDate12MonthsDate = dto.returnDate12MonthsDate ;

    output.returnDate6MonthsDate = dto.returnDate6MonthsDate ;
    output.nameOfInstitute = dto.nameOfInstitute;




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

    output.updateStatusInCanada = dto.updateStatusInCanada;
    output.updateNameDueToMarriageRequestedLastName = dto.updateNameDueToMarriageRequestedLastName;
    output.updateNameDueToMarriage = dto.updateNameDueToMarriage;
    output.updateNameDueToNameChange = dto.updateNameDueToNameChange;
    output.updateNameDueToError = dto.updateNameDueToError;
    output.updateBirthdate = dto.updateBirthdate;
    output.updateGender = dto.updateGender;
    output.updateGenderDesignation = dto.updateGenderDesignation;
    output.updateNameDueToMarriageDoc = dto.updateNameDueToMarriageDoc;
    output.updateNameDueToNameChangeDoc = dto.updateNameDueToNameChangeDoc;
    output.updateStatusInCanadaDocType = dto.updateStatusInCanadaDocType;
    output.updateNameDueToMarriageDocType = dto.updateNameDueToMarriageDocType;
    output.updateNameDueToNameChangeDocType = dto.updateNameDueToNameChangeDocType;

    output.updateNameDueToErrorDocType = dto.updateNameDueToErrorDocType;
    output.updateNameDueToErrorDoc = dto.updateNameDueToErrorDoc;

    output.updateBirthdateDocType = dto.updateBirthdateDocType;
    output.updateBirthdateDoc = dto.updateBirthdateDoc;

    output.updateGenderDocType = dto.updateGenderDocType;
    output.updateGenderDoc = dto.updateGenderDoc;

    output.updateGenderDesignationDocType = dto.updateGenderDesignationDocType;
    output.updateGenderDesignationDoc = dto.updateGenderDesignationDoc;

    output.updateStatusInCanadaDoc = dto.updateStatusInCanadaDoc;


    return output;
  }


  toMspAccountAppTransferObject(input: MspAccountApp): MspAccountDto {
    const dto: MspAccountDto = new MspAccountDto();
    dto.addressUpdate = input.accountChangeOptions.addressUpdate;

    dto.personInfoUpdate = input.accountChangeOptions.personInfoUpdate;
    dto.immigrationStatusChange = input.accountChangeOptions.immigrationStatusChange;

    dto.nameChangeDueToMarriage =
      input.accountChangeOptions.nameChangeDueToMarriage;
    dto.dependentChange = input.accountChangeOptions.dependentChange;
    dto.statusUpdate = input.accountChangeOptions.statusUpdate;
    console.log(input.applicant);
    dto.applicant = this.toPersonDtoForAccount(input.applicant);

    dto.hasSpouseAdded = input.hasSpouseAdded;
    dto.hasSpouseUpdated = input.hasSpouseUpdated;
    dto.hasSpouseRemoved = input.hasSpouseRemoved;
    dto.hasChildAdded = input.hasChildAdded;
    dto.hasChildRemoved = input.hasChildRemoved;
    dto.hasChildUpdated = input.hasChildUpdated;

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
    dto.departureDate = outofBCRecord.departureDate;
    dto.returnDate = outofBCRecord.returnDate;
    return dto;
  }

  private toOutofBCRecord(dto: OutofBCRecordDto) {
    if (dto == null) return null;

    const rec: OutofBCRecord = new OutofBCRecord();
    rec.reason = dto.reason;
    rec.location = dto.location;
    rec.departureDate = dto.departureDate;
    rec.returnDate = dto.returnDate;
    return rec;
  }

  private fromMspAccountTransferObject(dto: MspAccountDto): MspAccountApp {
    const output: MspAccountApp = new MspAccountApp();

    output.accountChangeOptions.addressUpdate = dto.addressUpdate;

    output.accountChangeOptions.personInfoUpdate = dto.personInfoUpdate;
    output.accountChangeOptions.immigrationStatusChange = dto.immigrationStatusChange;

    output.accountChangeOptions.dependentChange = dto.dependentChange;
    output.accountChangeOptions.statusUpdate = dto.statusUpdate;
    output.accountChangeOptions.nameChangeDueToMarriage =
      dto.nameChangeDueToMarriage;

    output.authorizedByApplicant = dto.authorizedByApplicant;
    output.authorizedByApplicantDate = dto.authorizedByApplicantDate;
    output.authorizedBySpouse = dto.authorizedBySpouse;

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    output.hasSpouseAdded = dto.hasSpouseAdded ;
    output.hasSpouseUpdated = dto.hasSpouseUpdated;
    output.hasSpouseRemoved = dto.hasSpouseRemoved;
    output.hasChildAdded = dto.hasChildAdded;
    output.hasChildRemoved = dto.hasChildRemoved;
    output.hasChildUpdated = dto.hasChildUpdated;

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
    output.dob = input.dob;

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
    output.dob = input.dateOfBirth;

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
