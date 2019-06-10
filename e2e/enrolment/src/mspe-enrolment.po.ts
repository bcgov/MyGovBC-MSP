import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { ContactPageTest } from './mspe-enrolment.data';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */
export class BaseMSPEnrolmentTestPage extends AbstractTestPage {

    protected diffMailAddressButton: WebElement = element(by.css('.mail-address-container .btn'));
    protected diffMailAddressCheckbox: WebElement = element(by.css('.custom-checkbox .custom-control-label'));

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp');
    }

    selectMSPEnrolment() {
        element(by.cssContainingText('button', 'New MSP enrolment application')).click();
    }

    clickButton(val: string) {
        element(by.css(`common-button[ng-reflect-label="${val}"]`)).element(by.cssContainingText('span', `${val}`)).click();
    }

    clickRadioButton(labelVal: string, forVal: string){
        element(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).element(by.css(`label[for*="${forVal}"]`)).click();
    }
    
    clickContinue() {
        element(by.css('button[class*="submit"]')).click();
    }

    clickModalContinue() {
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
    }

    clickDiffMailAddress() {
        this.diffMailAddressButton.click();
    }

    checkDiffMailAddress() {
        this.diffMailAddressCheckbox.click();
    }

}

export class EligibilityPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/prepare');
    }

    clickCheckBox() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    checkModal() {
        return element(by.css('common-consent-modal')).element(by.css('div[aria-labelledby="myLargeModalLabel"]')).isDisplayed();
    }

}

export class PersonalInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/personal-info');
    }

    typeOption(status: string) {
        element(by.css('input[role="combobox"]')).sendKeys(status);
        element(by.css('input[role="combobox"]')).sendKeys(protractor.Key.ENTER);
    }

    clickOption(status: string) {
        element(by.css('input[role="combobox"]')).click();
        element(by.cssContainingText('span', `${status}`)).click();
    }

    getInputVal() {
        // return element(by.css('div[class="ng-value"]')).element(by.css('span[class="ng-value-label"]')).getAttribute('value');
        return element(by.css('input[role="combobox"]')).getAttribute('value');
    }

    clickRadioButton(ariaVal: string, labelVal: string) {
       element(by.css(`div[aria-label*="${ariaVal}"]`)).element(by.cssContainingText('label', `${labelVal}`)).click();
    }
}

export class SpouseInfoPage extends PersonalInfoPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/spouse-info');
    }
    
}

export class ChildInfoPage extends PersonalInfoPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/child-info');
    }
    
}

export class ContactInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/address');
    }

    fillMailingAddress(data: ContactPageTest) {
        element(by.css('common-address:nth-child(1) [id^="street"]')).sendKeys(data.address);
        element(by.css('common-address:nth-child(1) [id^="city"]')).sendKeys(data.city);
        element(by.css('common-address:nth-child(1) [id^="postal"]')).sendKeys(data.postal);
    }

    fillContactNumber(data: ContactPageTest) {
        element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
    }

    
    
}

export class ReviewPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/review');
    }

    clickIcon() {
        // element(by.css('msp-contact-card'));
    }
    
}

export class AuthorizePage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/authorize');
    }
    
}
