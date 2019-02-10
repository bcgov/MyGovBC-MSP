import { Injectable } from '@angular/core';
import {MspDataService} from './msp-data.service';
import {LocalStorageService} from 'angular-2-local-storage';
import {BenefitApplication} from '../model/benefit-application.model';
import {AccountLetterApplication} from '../model/account-letter-application.model';
import FinancialAssistApplicationDto from '../model/financial-assist-application.dto';
import {FinancialAssistApplication} from '../model/financial-assist-application.model';
import BenefitApplicationDto from '../model/benefit-application.dto';

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
        return dto;
    }

    fromBenefitDataTransferObject(dto: BenefitApplicationDto): BenefitApplication {
        const output: BenefitApplication = new BenefitApplication();
        return output;
    }
}
