import { BaseMSPTestPage } from "../../msp.po";
import { element, by, browser } from "protractor";
import { PersonalInfoPageTest } from "../../supp-benefits/src/mspsb-supp-benefits.data";
import { ContactInfoPageTest } from "./mspretro-pa.data";
import { CANADA, BRITISH_COLUMBIA } from "moh-common-lib";

export class HomePage extends BaseMSPTestPage {

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
        this.clickButton('btn', 'Medical Services Plan premiums');
        element(by.css('msp-assist-rates-helper-modal select')).click();
        element(by.cssContainingText('option', `${year}`)).click();
    }

    isMSPPremiumRatesDisplayed(year: string) {
        return element(by.cssContainingText('span b', `${year}(January 1, ${year} to December 31, ${year})`)).isPresent();
    }

    checkErrorDisplayed(text: string) {
        return element(by.cssContainingText('div[class="text-danger"]', text)).isPresent();
    }

}

export class PersonalInfoPage extends HomePage {

    fillPersonalInfoPage(data: PersonalInfoPageTest) {
        this.fillPersonalInfo(data);
        this.uploadOneFile();
    }

    getNameInput(nameVal: string) {
        return element(by.css(`common-name[name="${nameVal}"] input`)).getAttribute('value');
    }
}

export class SpouseInfoPage extends PersonalInfoPage {

    fillSpouseInfoPage(spouseInfoData?: PersonalInfoPageTest) {
        //spouseInfoData.PHN = 9898293823;
        //spouseInfoData.SIN = 358745768;
        this.clickButton('btn', 'Add Spouse');
        this.selectYear(this.END_YEAR.toString());
        this.uploadOneFile();
        this.continue();
    }

    checkAddSpouse(){
        return element(by.cssContainingText('button', 'Add Spouse')).isPresent();
    }

    
}

export class ContactInfoPage extends PersonalInfoPage {

    fillContactInfoPage(data: ContactInfoPageTest) {
        this.typeStreet('addressLine1', data.streetAddress);
        this.typeCity(data.streetAddress);
        this.typeCountry(CANADA);
        this.typeProvince(BRITISH_COLUMBIA);
        this.typePostalCode(data.postal);
        this.typePhoneNum(data.mobile);
        this.continue();
    }

    getPostalCodeInput() {
        return element(by.css('common-postal-code input')).getAttribute('value');
    }

}

export class ReviewPage extends BaseMSPTestPage {
    
}

export class AuthorizePage extends BaseMSPTestPage {

    fillPage() {
        this.checkConsent('firstPersonAuthorize');
        this.checkHasSpouse().then(val => {
            if(val){
                this.checkConsent('secondPersonAuthorize');
            }
        });
        this.typeCaptcha();
        this.continue();
    }

    checkConsent(labelVal: string) {
        element(by.css(`label[for*="${labelVal}"]`)).click();
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

    checkHasSpouse() {
        return element(by.css('label[for="secondPersonAuthorize"]')).isPresent();
    }

}