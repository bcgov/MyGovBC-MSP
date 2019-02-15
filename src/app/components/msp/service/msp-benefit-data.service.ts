import { Injectable } from '@angular/core';
import {MspDataService} from './msp-data.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {BenefitApplication} from '../model/benefit-application.model';
import {AccountLetterApplication} from '../model/account-letter-application.model';
import FinancialAssistApplicationDto from '../model/financial-assist-application.dto';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import BenefitApplicationDto from '../model/benefit-application.dto';
import AddressDto from '../model/address.dto';

@Injectable({
  providedIn: 'root'
})
export class MspBenefitDataService extends MspDataService{

  private _benefitApp: BenefitApplication;
  private benefitAppStorageKey: string = 'supp-benefit';

  constructor(localStorageService: LocalStorageService) {
    super(localStorageService);
    this._benefitApp = this.fetchBenefitApplication();
  }

    get benefitApp(): BenefitApplication {
        return this._benefitApp;
    }

    //TODO Benefit
    removeMspBenefitApp(): void {
        this.destroyAll();
        this._benefitApp = new BenefitApplication();
    }

    saveBenefitApplication(): void {
        const dto: BenefitApplicationDto = this.toBenefitDataTransferObject(this._benefitApp);
        this.localStorageService.set(this.benefitAppStorageKey, dto);
        // this.localStorageService.set(this.finAssistMailingAddressStorageKey,dto.mailingAddress);
    }

    private fetchBenefitApplication(): BenefitApplication {
        const dto: BenefitApplicationDto =
            this.localStorageService.get<BenefitApplicationDto>(this.benefitAppStorageKey);

        // let mailAddressDto:AddressDto =
        //   this.localStorageService.get<AddressDto>(this.finAssistMailingAddressStorageKey);

        if (dto) {
            // dto.mailingAddress = mailAddressDto;
            return this.fromBenefitDataTransferObject(dto);
        } else {
            return new BenefitApplication();
        }
    }

    toBenefitDataTransferObject(input: BenefitApplication): BenefitApplicationDto {
        const dto: BenefitApplicationDto = new BenefitApplicationDto();

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

        super.convertToPersonDto(input.applicant, dto.applicant);
        super.convertToPersonDto(input.spouse, dto.spouse);
        super.convertMailingAddress(input, dto);
        super.convertResidentialAddress(input, dto);

        return dto;

    }

    fromBenefitDataTransferObject(dto: BenefitApplicationDto): BenefitApplication {
        if (!dto.residentialAddress) {
            dto.residentialAddress = new AddressDto();
        }
        if (!dto.mailingAddress) {
            dto.mailingAddress = new AddressDto();
        }
        const output: BenefitApplication = new BenefitApplication();

        output.infoCollectionAgreement = dto.infoCollectionAgreement;

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
}
