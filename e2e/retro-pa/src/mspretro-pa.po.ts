import { BaseMSPTestPage } from "../../msp.po";
import { element, by, browser } from "protractor";
import { PersonalInfoPageTest } from "../../supp-benefits/src/mspsb-supp-benefits.data";

export class BaseMSPRetroPATestPage extends BaseMSPTestPage {

}

export class HomePage extends BaseMSPRetroPATestPage {

    public START_YEAR = 2013;
    public END_YEAR = 2018;

    fillPage() {
        this.selectYear(this.END_YEAR.toString());
        this.continue();
    }

    fillPageWithMultipleYears() {
        this.selectAllYears();;
        this.continue();
    }

    selectAllYears() {
        for(var year = this.START_YEAR; year <= this.END_YEAR; year++){
            this.selectYear(year.toString());
        }
    }

    selectYear(year: string) {
        element(by.cssContainingText('label[for^="checkbox"]', `${year}`)).click();
    }

    checkMSPPremiumRates(year: string) {
        this.clickButton('btn', 'MSP premium rates');
        element(by.css('msp-assist-rates-helper-modal select')).click();
        element(by.cssContainingText('option', `${year}`)).click();
    }

    isMSPPremiumRatesDisplayed(year: string) {
        return element(by.cssContainingText('span b', `${year}(January 1, ${year} to December 31, ${year})`)).isPresent();
    }

}

export class PersonalInfoPage extends HomePage {

    fillPersonalInfoPage(data: PersonalInfoPageTest) {
        this.fillPage();
        this.fillPersonalInfo(data);
        this.uploadOneFile();
        this.continue();
    }
}