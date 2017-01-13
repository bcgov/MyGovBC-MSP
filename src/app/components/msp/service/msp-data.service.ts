import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import PersonDto from '../model/person.dto';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
import FinancialAssistApplicationDto from '../model/financial-assist-application.dto';
import MspApplicationDto from '../model/application.dto';
import AddressDto from '../model/address.dto';
import { StatusInCanada, Relationship } from '../model/status-activities-documents';
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
    dto.uncommonSituation = input.uncommonSituation;

    dto.firstName = input.firstName;
    dto.middleName = input.middleName;
    dto.lastName = input.lastName;
    dto.dob_day = input.dob_day;
    dto.dob_month = input.dob_month;
    dto.dob_year = input.dob_year;
    dto.middleName = input.middleName;
    dto.previous_phn = input.previous_phn;

    dto.arrivalToCanadaDay = input.arrivalToCanadaDay;
    dto.arrivalToCanadaMonth = input.arrivalToCanadaMonth;
    dto.arrivalToCanadaYear = input.arrivalToCanadaYear;
    dto.arrivalToBCDay = input.arrivalToBCDay;
    dto.arrivalToBCMonth = input.arrivalToBCMonth;
    dto.arrivalToBCYear = input.arrivalToBCYear;

    dto.movedFromProvince = input.movedFromProvince;
    dto.institutionWorkHistory = input.institutionWorkHistory;
    dto.dischargeYear = input.dischargeYear;
    dto.dischargeMonth = input.dischargeMonth;
    dto.dischargeDay = input.dischargeDay;
    dto.schoolName = input.schoolName;
    
    dto.studiesDepartureYear = input.studiesDepartureYear;
    dto.studiesDepartureMonth = input.studiesDepartureMonth;
    dto.studiesDepartureDay = input.studiesDepartureDay;

    dto.studiesFinishedYear = input.studiesFinishedYear;
    dto.studiesFinishedMonth = input.studiesFinishedMonth;
    dto.studiesFinishedDay = input.studiesFinishedDay;

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
    output.plannedAbsence = dto.plannedAbsence;
    output.uncommonSituation = dto.uncommonSituation;    
    output.firstName = dto.firstName;
    output.middleName = dto.middleName;
    output.lastName = dto.lastName;
    output.dob_day = dto.dob_day;
    output.dob_month = dto.dob_month;
    output.dob_year = dto.dob_year;
    output.middleName = dto.middleName;
    output.previous_phn = dto.previous_phn;

    output.arrivalToCanadaDay = dto.arrivalToCanadaDay;
    output.arrivalToCanadaMonth = dto.arrivalToCanadaMonth;
    output.arrivalToCanadaYear = dto.arrivalToCanadaYear;
    output.arrivalToBCDay = dto.arrivalToBCDay;
    output.arrivalToBCMonth = dto.arrivalToBCMonth;
    output.arrivalToBCYear = dto.arrivalToBCYear;

    output.movedFromProvince = dto.movedFromProvince;
    output.institutionWorkHistory = dto.institutionWorkHistory;
    output.dischargeYear = dto.dischargeYear;
    output.dischargeMonth = dto.dischargeMonth;
    output.dischargeDay = dto.dischargeDay;
    output.schoolName = dto.schoolName;

    output.studiesDepartureYear = dto.studiesDepartureYear;
    output.studiesDepartureMonth = dto.studiesDepartureMonth;
    output.studiesDepartureDay = dto.studiesDepartureDay;

    output.studiesFinishedYear = dto.studiesFinishedYear;
    output.studiesFinishedMonth = dto.studiesFinishedMonth;
    output.studiesFinishedDay = dto.studiesFinishedDay;

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

    dto.applicant = this.toPersonDto(input.applicant);
    if(input.spouse){
      dto.applicant.spouse = this.toPersonDto(input.spouse);
    }

    input.children.forEach( c => {
      let c2:PersonDto = this.toPersonDto(c);
      this.convertSchoolAddress(c, c2);
      dto.applicant.children = [...dto.applicant.children, c2];
    });

    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);

    // input.children.forEach( c => {
    //   this.convertSchoolAddress(c.schoolAddress, dto.applicant);
    // })
    return dto;
  }

  private fromMspApplicationTransferObject(dto:MspApplicationDto):MspApplication{
    let output:MspApplication = new MspApplication();
    output.applicant = this.fromPersonDto(dto.applicant);

    if(dto.applicant.spouse){
      output.addSpouse(this.fromPersonDto(dto.applicant.spouse));
    }

    dto.applicant.children.forEach( c=> {
      let child: Person = this.fromPersonDto(c)
      this.convertSchoolAddress(c, child);
      output.children = [...output.children, child];
    });

    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);

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

    dto.phoneNumber = input.phoneNumber;

    this.convertToPersonDto(input.applicant, dto.applicant);
    this.convertToPersonDto(input.spouse, dto.spouse);
    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);

    return dto;
  }

  /**
   * 
   */
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

    output.netIncomelastYear = dto.incomeLine236;
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

    output.phoneNumber = dto.phoneNumber;

    this.convertToPerson(dto.applicant, output.applicant);
    this.convertToPerson(dto.spouse, output.spouse);
    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);
    return output;
  }

}