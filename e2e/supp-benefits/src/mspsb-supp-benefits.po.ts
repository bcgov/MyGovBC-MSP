import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { PersonalInfoPageTest, ContactInfoPageTest } from './mspsb-supp-benefits.data';
import { BaseMSPTestPage } from '../../msp.po';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */

export class PreparePage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/prepare');
    }

    typeNetIncome(val: string) {
        element(by.css('input[id="netIncome"]')).sendKeys(val);
    }

    typeSpouseIncome(val : string) {
        element(by.css('input[id="spouseIncomeLine236"]')).sendKeys(val);
    }

    typeChildrenCount(val: string) {
        element(by.css('input[id="childrenCount"]')).sendKeys(val);
    }

    typeLine214(val: string) {
        element(by.css('input[id="line214"]')).sendKeys(val);
    }

    typeLine117(val: string) {
        element(by.css('input[id="line117"]')).sendKeys(val);
    }

    clickRadioButtonDuplicate(labelVal: string, forVal: string){
        element.all(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).last().element(by.css(`label[for*="${forVal}"]`)).click();
    }

    checkHouseholdIncome() {
        return element(by.cssContainingText('span' , 'Total household income')).element(by.xpath('../..')).element(by.css('td[class*="padding"] span')).getText();  
    }

    clickContinueDisabilityCredit() {
        element(by.cssContainingText('button', 'Yes, continue')).click();
    }

    checkSpouseDisabilityCredit() {
        return element(by.cssContainingText('td', 'Spouse disability credit')).isPresent();
    }

    checkChildrenDeduction() {
        return element(by.cssContainingText('td', 'Children')).isPresent();
    }

}

export class PersonalInfoPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/personal-info');
    }

    fillInfo(info: PersonalInfoPageTest) {
        this.typeName('first_name', info.firstName);
        if(info.middleName){
            this.typeName('middle_name', info.middleName);
        }
        this.typeName('last_name', info.lastName);
        const month = info.birthDate.getMonth();
        const year = info.birthDate.getFullYear();
        const day = info.birthDate.getDate();
        element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
        this.typeText('day', day.toString());
        this.typeText('year', year.toString());
        this.scrollDown();
        this.typePHN('9999999998');
        this.typeText('sin', '712234123');
        this.uploadOneFile();
    }

}

export class SpouseInfoPage extends PersonalInfoPage {

    navigateTo() {
        return browser.get('/msp/benefit/spouse-info');
    }

    addSpouse() {
        element(by.css('common-button[ng-reflect-label*="Add Spouse"] span')).click();
    }

}

export class ContactInfoPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/contact-info');
    }

    fillAddress(data: ContactInfoPageTest) {
        element.all(by.css('common-country input')).first().sendKeys(data.country);
        element.all(by.css('common-province input')).first().sendKeys(data.province);
        element.all(by.css('common-street input')).first().sendKeys(data.address);
        element.all(by.css('common-city input')).first().sendKeys(data.city);
        element.all(by.css('common-postal-code input')).first().sendKeys(data.postal);
    }

    fillMailingAddress(data: ContactInfoPageTest) {
        element.all(by.css('common-country input')).last().sendKeys(data.country);
        element.all(by.css('common-province input')).last().sendKeys(data.province);
        element.all(by.css('common-street input')).last().sendKeys(data.address);
        element.all(by.css('common-city input')).last().sendKeys(data.city);
        element.all(by.css('common-postal-code input')).last().sendKeys(data.postal);
    }

    fillContactNumber(data: ContactInfoPageTest) {
        element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
    }
}

export class ReviewPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/review');
    }

}

export class AuthorizePage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/authorize');
    }

    checkConsent(labelVal: string) {
        element(by.css(`label[for*="${labelVal}"]`)).click();
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

}