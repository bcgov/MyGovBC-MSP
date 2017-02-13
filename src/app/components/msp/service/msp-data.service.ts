import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import PersonDto from '../model/person.dto';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
import FinancialAssistApplicationDto from '../model/financial-assist-application.dto';
import MspApplicationDto from '../model/application.dto';
import AddressDto from '../model/address.dto';
import {OutofBCRecordDto} from '../model/outof-bc-record.dto';
import {OutofBCRecord} from '../model/outof-bc-record.model';
import { StatusInCanada, Relationship } from '../model/status-activities-documents';
import {puts} from "util";
@Injectable()
export default class MspDataService {
  private _mspApplication: MspApplication;
  private _finAssistApp: FinancialAssistApplication;
  private finAssistAppStorageKey:string = 'financial-assist';
  // private finAssistMailingAddressStorageKey:string = 'financial-assist-mailing-address';
  private mspAppStorageKey:string = 'msp-application';

  constructor(private localStorageService: LocalStorageService){
    this._finAssistApp = this.fetchFinAssistApplication();
    this._mspApplication = this.fetchMspApplication();
  }

  destroyAll() {
    this.localStorageService.clearAll();
  }

  getMspApplication(): MspApplication {
    return this._mspApplication;
  }
  get finAssistApp(): FinancialAssistApplication {
    return this._finAssistApp;
  }

  saveMspApplication():void {
    let dto:MspApplicationDto = this.toMspApplicationTransferObject(this._mspApplication);
    this.localStorageService.set(this.mspAppStorageKey,dto);
  }

  private fetchMspApplication(): MspApplication {
    let dto:MspApplicationDto = 
      this.localStorageService.get<MspApplicationDto>(this.mspAppStorageKey);

    if(dto){
      console.log('MspApplicationDto from local storage: ', dto);
      return this.fromMspApplicationTransferObject(dto);
    }else{
      return new MspApplication();
    }
  }

  saveFinAssistApplication():void {
    console.log('this._finAssistApp before conversion and saving: ');
    console.log(this._finAssistApp);
    let dto:FinancialAssistApplicationDto = this.toFinAssistDataTransferObject(this._finAssistApp);
    this.localStorageService.set(this.finAssistAppStorageKey,dto);
    // this.localStorageService.set(this.finAssistMailingAddressStorageKey,dto.mailingAddress);
  }

  private fetchFinAssistApplication():FinancialAssistApplication{
    let dto:FinancialAssistApplicationDto = 
      this.localStorageService.get<FinancialAssistApplicationDto>(this.finAssistAppStorageKey);

    // let mailAddressDto:AddressDto = 
    //   this.localStorageService.get<AddressDto>(this.finAssistMailingAddressStorageKey);

    if(dto){
      // dto.mailingAddress = mailAddressDto;
      return this.fromFinAssistDataTransferObject(dto);
    }else{
      return new FinancialAssistApplication();
    }
  }

  private convertMailingAddress(input:any, output:any){
    this.convertAddress(input, output, 'mailingAddress');
  }
  private convertResidentialAddress(input:any, output:any){
    this.convertAddress(input, output, 'residentialAddress');
  }
  private convertSchoolAddress(input:any, output:any){
    this.convertAddress(input, output, 'schoolAddress');
  }
  private convertAddress(input:any, output:any, property:string){
    output[property].addressLine1 = input[property].addressLine1;
    output[property].addressLine2 = input[property].addressLine2;
    output[property].addressLine3 = input[property].addressLine3;
    output[property].postal = input[property].postal;
    output[property].city = input[property].city;
    output[property].province = input[property].province;
    output[property].country = input[property].country;
  }

  removeFinAssistApplication():void{
    let result:boolean = this.localStorageService.remove(this.finAssistAppStorageKey);
    this._finAssistApp = new FinancialAssistApplication();
  }
  removeMspApplication():void{
    this.localStorageService.remove(this.mspAppStorageKey);
    this._mspApplication = new MspApplication();
  }

  private toPersonDto(input: Person): PersonDto{
    let dto:PersonDto = new PersonDto();

    dto.id = input.id;
    dto.relationship = input.relationship;
    dto.liveInBC = input.liveInBC;
    dto.stayForSixMonthsOrLonger = input.stayForSixMonthsOrLonger;
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

    dto.outsideBC = input.outsideBC
    dto.outsideBCDepartureDateYear = input.outsideBCDepartureDateYear;
    dto.outsideBCDepartureDateMonth = input.outsideBCDepartureDateMonth;
    dto.outsideBCDepartureDateDay = input.outsideBCDepartureDateDay;
    dto.outsideBCReturnDateYear = input.outsideBCReturnDateYear;
    dto.outsideBCReturnDateMonth = input.outsideBCReturnDateMonth;
    dto.outsideBCReturnDateDay = input.outsideBCReturnDateDay;
    dto.outsideBCFamilyMemberReason = input.outsideBCFamilyMemberReason;

    dto.declarationForOutsideOver30Days = input.declarationForOutsideOver30Days;

    if(input.gender){
      dto.gender = input.gender.valueOf();
    }
    dto.status = input.status;
    dto.currentActivity = input.currentActivity;

    dto.images = input.documents.images; 
    return dto;
  }

  private fromPersonDto(dto: PersonDto):Person {
    let output:Person = new Person(dto.relationship);

    output.id = dto.id;
    output.liveInBC = dto.liveInBC;
    output.stayForSixMonthsOrLonger = dto.stayForSixMonthsOrLonger;
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

    output.outsideBC = dto.outsideBC;
    output.outsideBCDepartureDateYear = dto.outsideBCDepartureDateYear;
    output.outsideBCDepartureDateMonth = dto.outsideBCDepartureDateMonth;
    output.outsideBCDepartureDateDay = dto.outsideBCDepartureDateDay;
    output.outsideBCReturnDateYear = dto.outsideBCReturnDateYear;
    output.outsideBCReturnDateMonth = dto.outsideBCReturnDateMonth;
    output.outsideBCReturnDateDay = dto.outsideBCReturnDateDay;
    output.outsideBCFamilyMemberReason = dto.outsideBCFamilyMemberReason;

    output.declarationForOutsideOver30Days = dto.declarationForOutsideOver30Days;

    if(dto.gender){
      output.gender = dto.gender;
    }
    output.status = dto.status;
    output.currentActivity = dto.currentActivity;

    dto.images.forEach(img => {
      output.documents.images = [...output.documents.images, img];
    });

    return output  
  }

  toMspApplicationTransferObject(input:MspApplication):MspApplicationDto {
    let dto:MspApplicationDto = new MspApplicationDto();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;
    dto.unUsualCircumstance = input.unUsualCircumstance;
    dto.phoneNumber = input.phoneNumber;

    dto.mailingSameAsResidentialAddress = input.mailingSameAsResidentialAddress
    dto.applicant = this.toPersonDto(input.applicant);
    if(input.spouse){
      dto.applicant.spouse = this.toPersonDto(input.spouse);
    }

    input.children.forEach( c => {
      let c2:PersonDto = this.toPersonDto(c);
      c2.outOfBCRecords = this.toOutofBCRecordDtoCollection(c.outOfBCRecords);

      this.convertSchoolAddress(c, c2);
      dto.applicant.children = [...dto.applicant.children, c2];

    });

    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);

    dto.applicant.outOfBCRecords = this.toOutofBCRecordDtoCollection(input.applicant.outOfBCRecords);
    if(input.spouse){
      dto.applicant.spouse.outOfBCRecords = 
        this.toOutofBCRecordDtoCollection(input.spouse.outOfBCRecords);
    }

    dto.outsideBCFor30Days = input.outsideBCFor30Days;

    return dto;
  }


  private toOutofBCRecordDtoCollection(outofBCRecordCol: OutofBCRecord[]) {
    let dtoCol: OutofBCRecordDto[] = [];
    if(!!outofBCRecordCol){
      outofBCRecordCol.forEach(
        rec => {
          if (!rec.isEmpty) {
            let temp = this.toOutofBCRecordDto(rec);
            dtoCol = [...dtoCol, temp];
          }
        }
      );
    }
    return dtoCol;
  }

  private toOutofBCRecordCollection(outofBCRecordDtoCol: OutofBCRecordDto[]) {
    let records: OutofBCRecord[] = [];
    if(!!outofBCRecordDtoCol) {
      outofBCRecordDtoCol.forEach(
        dto => {
          let temp = this.toOutofBCRecord(dto);
          records = [...records, temp];
        }
      );
    }
    return records;
  }

  private toOutofBCRecordDto(outofBCRecord: OutofBCRecord){
    let dto:OutofBCRecordDto = new OutofBCRecordDto();
    dto.reasonAndLocation = outofBCRecord.reasonAndLocation;
    dto.departureDay = outofBCRecord.departureDay;
    dto.departureMonth = outofBCRecord.departureMonth;
    dto.departureYear = outofBCRecord.departureYear;
    dto.returnDay = outofBCRecord.returnDay;
    dto.returnMonth = outofBCRecord.returnMonth;
    dto.returnYear = outofBCRecord.returnYear;

    return dto;
  }

  private toOutofBCRecord(dto: OutofBCRecordDto){
    let rec:OutofBCRecord = new OutofBCRecord();
    rec.reasonAndLocation = dto.reasonAndLocation;
    rec.departureDay = dto.departureDay;
    rec.departureMonth = dto.departureMonth;
    rec.departureYear = dto.departureYear;
    rec.returnDay = dto.returnDay;
    rec.returnMonth = dto.returnMonth;
    rec.returnYear = dto.returnYear;

    return rec;
  }

  private fromMspApplicationTransferObject(dto:MspApplicationDto):MspApplication{
    let output:MspApplication = new MspApplication();
    output.unUsualCircumstance = dto.unUsualCircumstance;
    output.applicant = this.fromPersonDto(dto.applicant);
    output.infoCollectionAgreement = dto.infoCollectionAgreement;
    output.mailingSameAsResidentialAddress = dto.mailingSameAsResidentialAddress
    
    output.phoneNumber = dto.phoneNumber;

    if(dto.applicant.spouse){
      output.addSpouse(this.fromPersonDto(dto.applicant.spouse));
    }

    dto.applicant.children.forEach( c => {
      let child: Person = this.fromPersonDto(c)
      child.outOfBCRecords = this.toOutofBCRecordCollection(c.outOfBCRecords);
      this.convertSchoolAddress(c, child);
      output.children = [...output.children, child];
    });

    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);

    output.applicant.outOfBCRecords = this.toOutofBCRecordCollection(dto.applicant.outOfBCRecords);
    if(dto.applicant.spouse){
      output.spouse.outOfBCRecords = 
        this.toOutofBCRecordCollection(dto.applicant.spouse.outOfBCRecords);
    }
    
    output.outsideBCFor30Days = dto.outsideBCFor30Days;

    return output;
  }

  /**
   * Convert data model object to data transfer object that is suitable for client
   * side storage (local or session storage)
   * 
   * For financial assistance application.
   */
  toFinAssistDataTransferObject(input:FinancialAssistApplication):FinancialAssistApplicationDto{
    let dto:FinancialAssistApplicationDto  = new FinancialAssistApplicationDto();

    dto.infoCollectionAgreement = input.infoCollectionAgreement;

    dto.incomeLine236 = input.netIncomelastYear;
    dto.ageOver65 = input.ageOver65;
    dto.hasSpouseOrCommonLaw = input.hasSpouseOrCommonLaw;
    dto.spouseAgeOver65 = input.spouseAgeOver65;
    dto.spouseIncomeLine236 = input.spouseIncomeLine236;
    dto.childrenCount = input.childrenCount;
    dto.claimedChildCareExpense_line214 = input.claimedChildCareExpense_line214;
    dto.reportedUCCBenefit_line117 = input.reportedUCCBenefit_line117;
    dto.selfDisabilityCredit = input.selfDisabilityCredit;
    dto.spouseEligibleForDisabilityCredit = input.spouseEligibleForDisabilityCredit;
    dto.spouseDSPAmount_line125 = input.spouseDSPAmount_line125;
    dto.childWithDisabilityCount = input.childWithDisabilityCount;

    dto.applicantClaimForAttendantCareExpense = input.applicantClaimForAttendantCareExpense;
    dto.spouseClaimForAttendantCareExpense = input.spouseClaimForAttendantCareExpense;
    dto.childClaimForAttendantCareExpense = input.childClaimForAttendantCareExpense;
    dto.childClaimForAttendantCareExpenseCount = input.childClaimForAttendantCareExpenseCount;

    dto.attendantCareExpense = input.attendantCareExpense;

    dto.authorizedByApplicant = input.authorizedByApplicant;
    dto.authorizedBySpouse = input.authorizedBySpouse;
    dto.authorizedByAttorney = input.authorizedByAttorney;

    dto.powerOfAttorneyDocs = input.powerOfAttorneyDocs;
    dto.attendantCareExpenseReceipts = input.attendantCareExpenseReceipts;

    dto.phoneNumber = input.phoneNumber;

    dto.assistYears = input.assistYears;
    dto.assistYeaDocs = input.assistYeaDocs;    

    this.convertToPersonDto(input.applicant, dto.applicant);
    this.convertToPersonDto(input.spouse, dto.spouse);
    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);

    return dto;
  }

  /**
   * Convert DTO object from local storage to data model object that is bound to screen.
   * For financial assistance application
   */
  fromFinAssistDataTransferObject(dto:FinancialAssistApplicationDto): FinancialAssistApplication{
    if(!dto.residentialAddress){
      dto.residentialAddress = new AddressDto();
    }
    if(!dto.mailingAddress){
      dto.mailingAddress = new AddressDto();
    }
    let output:FinancialAssistApplication = new FinancialAssistApplication();

    output.infoCollectionAgreement = dto.infoCollectionAgreement;

    console.log('set netIncomelastYear from value: ' + dto.incomeLine236);
    output.netIncomelastYear = dto.incomeLine236;
    console.log(' netIncomelastYear after setting the value: ' + output.netIncomelastYear);
    output.ageOver65 = dto.ageOver65;
    output.setSpouse = dto.hasSpouseOrCommonLaw;
    output.spouseAgeOver65 = dto.spouseAgeOver65;
    output.spouseIncomeLine236 = dto.spouseIncomeLine236;
    output.childrenCount = dto.childrenCount;
    output.claimedChildCareExpense_line214 = dto.claimedChildCareExpense_line214;
    output.reportedUCCBenefit_line117 = dto.reportedUCCBenefit_line117;
    output.selfDisabilityCredit = dto.selfDisabilityCredit;
    output.spouseEligibleForDisabilityCredit = dto.spouseEligibleForDisabilityCredit;
    output.spouseDSPAmount_line125 = dto.spouseDSPAmount_line125;
    output.childWithDisabilityCount = dto.childWithDisabilityCount;

    output.applicantClaimForAttendantCareExpense = dto.applicantClaimForAttendantCareExpense;
    output.spouseClaimForAttendantCareExpense = dto.spouseClaimForAttendantCareExpense;
    output.childClaimForAttendantCareExpense = dto.childClaimForAttendantCareExpense;
    output.childClaimForAttendantCareExpenseCount = dto.childClaimForAttendantCareExpenseCount;
    output.attendantCareExpense = dto.attendantCareExpense;

    output.phoneNumber = dto.phoneNumber;

    output.authorizedByApplicant = dto.authorizedByApplicant;
    output.authorizedBySpouse = dto.authorizedBySpouse;
    output.authorizedByAttorney = dto.authorizedByAttorney;
    
    output.powerOfAttorneyDocs = dto.powerOfAttorneyDocs;
    output.attendantCareExpenseReceipts = dto.attendantCareExpenseReceipts;

    output.assistYears = dto.assistYears || [];
    output.assistYeaDocs = dto.assistYeaDocs || [];    

    this.convertToPerson(dto.applicant, output.applicant);
    this.convertToPerson(dto.spouse, output.spouse);
    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);
    return output;
  }

  private convertToPersonDto(input:Person, output:PersonDto){
    output.dob_day = input.dob_day;
    output.dob_month = input.dob_month;
    output.dob_year = input.dob_year;

    output.firstName = input.firstName;
    output.middleName = input.middleName;
    output.lastName = input.lastName;

    output.sin = input.sin;
    output.previous_phn = input.previous_phn;
    output.liveInBC = input.liveInBC;
    output.stayForSixMonthsOrLonger = input.stayForSixMonthsOrLonger;
    output.plannedAbsence = input.plannedAbsence;
  }
  private convertToPerson(input:PersonDto, output:Person){
    output.dob_day = input.dob_day;
    output.dob_month = input.dob_month;
    output.dob_year = input.dob_year;

    output.firstName = input.firstName;
    output.middleName = input.middleName;
    output.lastName = input.lastName;

    output.sin = input.sin;
    output.previous_phn = input.previous_phn;
    output.liveInBC = input.liveInBC;
    output.stayForSixMonthsOrLonger = input.stayForSixMonthsOrLonger;
    output.plannedAbsence = input.plannedAbsence;
  }
  

}