import { Injectable } from '@angular/core';
import { MspDataService } from '../../../services/msp-data.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { BenefitApplication } from '../models/benefit-application.model';
import { BenefitApplicationDto } from '../models/benefit-application.dto';
import { AddressDto } from '../../../models/address.dto';

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
        dto.isEligible = input.isEligible;
        dto.hasSpouse = input.hasSpouse;
        dto.incomeLine236 = input.netIncomelastYear;
        dto.ageOver65 = input.ageOver65;
        dto.hasSpouseOrCommonLaw = input.hasSpouseOrCommonLaw;
        dto.spouseAgeOver65 = input.spouseAgeOver65;
        dto.haveChildrens = input.haveChildrens;
        dto.spouseIncomeLine236 = input.spouseIncomeLine236;
        dto.childrenCount = input.childrenCount;
        dto.claimedChildCareExpense_line214 = input.claimedChildCareExpense_line214;
        dto.reportedUCCBenefit_line117 = input.reportedUCCBenefit_line117;
        dto.selfDisabilityCredit = input.selfDisabilityCredit;
        dto.spouseEligibleForDisabilityCredit = input.spouseEligibleForDisabilityCredit;
        dto.spouseDSPAmount_line125 = input.spouseDSPAmount_line125;
        dto.childWithDisabilityCount = input.childWithDisabilityCount;
        dto.childClaimForDisabilityCredit = input.childClaimForDisabilityCredit;

        dto.applicantClaimForAttendantCareExpense = input.applicantClaimForAttendantCareExpense;
        dto.spouseClaimForAttendantCareExpense = input.spouseClaimForAttendantCareExpense;
        dto.childClaimForAttendantCareExpense = input.childClaimForAttendantCareExpense;
        dto.childClaimForAttendantCareExpenseCount = input.childClaimForAttendantCareExpenseCount;
        dto.isEligible = input.isEligible;

        dto.hasRegisteredDisabilityPlan = input.hasRegisteredDisabilityPlan;
        dto.hasClaimedAttendantCareExpenses = input.hasClaimedAttendantCareExpenses;
        dto.applicantEligibleForDisabilityCredit = input.applicantEligibleForDisabilityCredit;

        dto.attendantCareExpense = input.attendantCareExpense;

        dto.authorizedByApplicant = input.authorizedByApplicant;
        dto.authorizedBySpouse = input.authorizedBySpouse;
        dto.authorizedByAttorney = input.authorizedByAttorney;

        dto.powerOfAttorneyDocs = input.powerOfAttorneyDocs;
        dto.attendantCareExpenseReceipts = input.attendantCareExpenseReceipts;

        dto.phoneNumber = input.phoneNumber;
        dto.spaEnvRes = input.spaEnvRes;
        dto.cutoffYear = input.cutoffYear;
        dto.isCutoffDate = input.isCutoffDate;
        dto.totalDeduction = input.totalDeduction;

        dto.taxYear = input.taxYear;
        //dto.assistYearDocs = input.assistYearDocs;

        super.convertToPersonDto(input.applicant, dto.applicant);
        super.convertToPersonDto(input.spouse, dto.spouse);
        super.convertMailingAddress(input, dto);
        //super.convertResidentialAddress(input, dto);

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
        output.spaEnvRes = dto.spaEnvRes;
        output.isEligible = dto.isEligible;


        output.netIncomelastYear = dto.incomeLine236;
        output.ageOver65 = dto.ageOver65;
        output.setSpouse = dto.hasSpouseOrCommonLaw;
        output.hasSpouse = dto.hasSpouse;
        output.spouseAgeOver65 = dto.spouseAgeOver65;
        //output.assistYearDocs = dto.assistYearDocs;
        output.haveChildrens = dto.haveChildrens;
        output.spouseIncomeLine236 = dto.spouseIncomeLine236;
        output.childrenCount = dto.childrenCount;
        output.claimedChildCareExpense_line214 = dto.claimedChildCareExpense_line214;
        output.reportedUCCBenefit_line117 = dto.reportedUCCBenefit_line117;
        output.selfDisabilityCredit = dto.selfDisabilityCredit;
        output.spouseEligibleForDisabilityCredit = dto.spouseEligibleForDisabilityCredit;
        output.spouseDSPAmount_line125 = dto.spouseDSPAmount_line125;
        output.childWithDisabilityCount = dto.childWithDisabilityCount;
        output.applicantEligibleForDisabilityCredit = dto.applicantEligibleForDisabilityCredit;
        output.childClaimForDisabilityCredit = dto.childClaimForDisabilityCredit;

        output.applicantClaimForAttendantCareExpense = dto.applicantClaimForAttendantCareExpense;
        output.spouseClaimForAttendantCareExpense = dto.spouseClaimForAttendantCareExpense;
        output.childClaimForAttendantCareExpense = dto.childClaimForAttendantCareExpense;
        output.childClaimForAttendantCareExpenseCount = dto.childClaimForAttendantCareExpenseCount;
        output.attendantCareExpense = dto.attendantCareExpense;

        output.hasRegisteredDisabilityPlan = dto.hasRegisteredDisabilityPlan;
        output.hasClaimedAttendantCareExpenses = dto.hasClaimedAttendantCareExpenses;

        output.phoneNumber = dto.phoneNumber;

        output.authorizedByApplicant = dto.authorizedByApplicant;
        output.authorizedBySpouse = dto.authorizedBySpouse;
        output.authorizedByAttorney = dto.authorizedByAttorney;

        output.powerOfAttorneyDocs = dto.powerOfAttorneyDocs;
        output.attendantCareExpenseReceipts = dto.attendantCareExpenseReceipts;

        output.taxYear = dto.taxYear;
        output.cutoffYear = dto.cutoffYear;
        output.isCutoffDate = dto.isCutoffDate;
        output.totalDeduction = dto.totalDeduction;
//        output.assistYearDocs = dto.assistYearDocs || [];

        this.convertToPerson(dto.applicant, output.applicant);
        this.convertToPerson(dto.spouse, output.spouse);
        this.convertMailingAddress(dto, output);
       // this.convertResidentialAddress(dto, output);
        return output;


    }
}
