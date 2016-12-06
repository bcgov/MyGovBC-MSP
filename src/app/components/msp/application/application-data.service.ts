import { Injectable } from '@angular/core';
import {MspApplication, Person} from '../model/application.model';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import { LocalStorageService } from 'angular-2-local-storage';
import {FinancialAssistApplicationDto} from '../dto/financial-assist-application.dto';
@Injectable()
export default class MspApplicationDataService {
  private application: MspApplication;
  private finAssistApplication: FinancialAssistApplication;

  constructor(private localStorageService: LocalStorageService){

    this.finAssistApplication = this.getFinAssistApplication();

    let existingMainApp = this.localStorageService.get<MspApplication>('msp-appl');
    if(!existingMainApp){
      this.application = new MspApplication();
    }else{
      this.application = new MspApplication();
      // turn on the following in when the entire application model class is wired up with screens.
      // this.application = existingMainApp;
    }

    // console.log('init data service, fin assistance application: ' + JSON.stringify(this.finAssistApplication));
  } 

  getApplication(): MspApplication {
    return this.application;
  }

  get finAssistApp(): FinancialAssistApplication {
    return this.finAssistApplication;
  }

  saveFinAssistApplication():void {
    let dto:FinancialAssistApplicationDto = this.toFinAssistDataTransferObject(this.finAssistApplication);
    this.localStorageService.set('financial-appl',dto);
  }

  getFinAssistApplication():FinancialAssistApplication{
    let dto:FinancialAssistApplicationDto = 
      this.localStorageService.get<FinancialAssistApplicationDto>('financial-appl');

    if(dto){
      return this.fromFinAssistDataTransferObject(dto);
    }else{
      return new FinancialAssistApplication();
    }
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

    return dto;
  }

  fromFinAssistDataTransferObject(dto:FinancialAssistApplicationDto): FinancialAssistApplication{
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

    return output;
  }

  saveMspApplication():void {
    this.localStorageService.set('msp-appl',this.application);
  }
}