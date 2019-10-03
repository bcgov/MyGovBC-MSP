import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { ContactPageTest, PersonalInfoPageTest } from './mspe-enrolment.data';
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

    clickRadioButtonByName(nameVal: string, forVal: string){
        element(by.css(`common-radio[name^="${nameVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    clickRadioButtonByID(idVal: string, forVal: string){
        element(by.css(`common-radio[id^="${idVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
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

    clickProgressBar(hrefVal: string){
        element(by.css(`a[href*="${hrefVal}"]`)).element(by.css('span')).click();
    }



}

export class EligibilityPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    fillPage() {
        this.navigateTo();
        this.clickAgree();
        this.clickModalContinue();
        this.clickRadioButtonByName('LiveInBC', 'true');
        this.clickRadioButtonByName('PlannedAbsence', 'false');
        this.clickRadioButtonByName('UnusualCircumstance', 'false');
        this.clickContinue();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/check-eligibility');
    }

    clickAgree() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    clickModalContinue() {
         element(by.cssContainingText('button', 'Continue')).click();
    }

}

export class PersonalInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    fillPage(data: PersonalInfoPageTest) {
        this.clickOption('Your immigration status', 'Canadian citizen');
        this.clickRadioButton('statausReason', '0');
    }

    navigateTo() {
        return browser.get('/msp/enrolment/personal-info');
    }

    clickOption(idVal: string, status: string) {
        element(by.css(`input[id^="${idVal}"]`)).click();
        element(by.cssContainingText('ng-dropdown-panel span', `${status}`)).click();
    }

    getInputVal() {
        // return element(by.css('div[class="ng-value"]')).element(by.css('span[class="ng-value-label"]')).getAttribute('value');
        return element(by.css('input[role="combobox"]')).getAttribute('value');
    }

    clickRadioButton(ariaVal: string, labelVal: string) {
       element(by.css(`div[aria-label*="${ariaVal}"]`)).element(by.cssContainingText('label', `${labelVal}`)).click();
    }

    // TODO - Move over to lib
    // Sample file : file:///space/workspace/MyGovBC-MSP/e2e/sample.jpg
    uploadFile(absolutePath = '/space/workspace/MyGovBC-MSP/e2e/sample.jpg') {
        element(by.css('common-file-uploader input[type="file"]')).sendKeys(absolutePath); 
        // element(by.css('input[type="file"]')).sendKeys(protractor.Key.ENTER);  // Causes error?
        // element(by.css('common-file-uploader')).element(by.css('i')).click();
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

    clickIcon(tagName: string, val: string) {
        element(by.css(`${tagName}[ng-reflect-edit-router-link*="${val}"]`)).element(by.css('i')).click();
    }

}

export class AuthorizePage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/authorize');
    }

    checkAgree() {
        element(by.css('common-checkbox[ng-reflect-label*="Yes"]')).element(by.css('input')).click();
    }
    
}
