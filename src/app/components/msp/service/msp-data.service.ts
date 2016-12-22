import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
import FinancialAssistApplicationDto from '../model/financial-assist-application.dto';
import MspApplicationDto from '../model/application.dto';
import AddressDto from '../model/address.dto';

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

    // let existingMainApp = this.localStorageService.get<MspApplication>(this.mspAppStorageKey);
    // if(!existingMainApp){
    //   this._mspApplication = new MspApplication();
    // }else{
    //   this._mspApplication = new MspApplication();
    // }

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

  removeFinAssistApplication():void{
    let result:boolean = this.localStorageService.remove(this.finAssistAppStorageKey);
    this._finAssistApp = new FinancialAssistApplication();
  }
  removeMspApplication():void{
    this.localStorageService.remove(this.mspAppStorageKey);
    this._mspApplication = new MspApplication();
  }

  toMspApplicationTransferObject(input:MspApplication):MspApplicationDto {
    let dto:MspApplicationDto = new MspApplicationDto();

    //Fill in conversion logic here
    dto.applicant.liveInBC = input.applicant.liveInBC;
    dto.applicant.stayForSixMonthsOrLonger = input.applicant.stayForSixMonthsOrLonger;
    dto.applicant.plannedAbsence = input.applicant.plannedAbsence;

    dto.applicant.firstName = input.applicant.firstName;
    dto.applicant.lastName = input.applicant.lastName;
    dto.applicant.dob_day = input.applicant.dob_day;
    dto.applicant.dob_month = input.applicant.dob_month;
    dto.applicant.dob_year = input.applicant.dob_year;
    dto.applicant.middleName = input.applicant.middleName;
    dto.applicant.previous_phn = input.applicant.previous_phn;

    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);
    return dto;
  }

  private convertMailingAddress(input:any, output:any){
    this.convertAddress(input, output, 'mailingAddress');
  }
  private convertResidentialAddress(input:any, output:any){
    this.convertAddress(input, output, 'residentialAddress');
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


  fromMspApplicationTransferObject(dto:MspApplicationDto):MspApplication{
    let output:MspApplication = new MspApplication();
    //Fill in conversion logic here
    output.applicant.firstName = dto.applicant.firstName;
    output.applicant.lastName = dto.applicant.lastName;
    output.applicant.dob_day = dto.applicant.dob_day;
    output.applicant.dob_month = dto.applicant.dob_month;
    output.applicant.dob_year = dto.applicant.dob_year;
    output.applicant.middleName = dto.applicant.middleName;
    output.applicant.previous_phn = dto.applicant.previous_phn;

    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);

    return output;
  }

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

    this.convertMailingAddress(input, dto);
    this.convertResidentialAddress(input, dto);

    return dto;
  }

  fromFinAssistDataTransferObject(dto:FinancialAssistApplicationDto): FinancialAssistApplication{
    if(!dto.residentialAddress){
      console.log('create residentialAddress dto');
      dto.residentialAddress = new AddressDto();
    }
    if(!dto.mailingAddress){
      console.log('create mailingAddress dto');
      
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

    this.convertMailingAddress(dto, output);
    this.convertResidentialAddress(dto, output);
    return output;
  }

}