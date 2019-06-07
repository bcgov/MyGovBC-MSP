import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */
export class BaseMSPEnrolmentTestPage extends AbstractTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp');
    }

    clickButton() {
        element(by.cssContainingText('button', 'New MSP enrolment application')).click();
    }

    clickRadioButton(labelVal: string, forVal: string){
        element(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).element(by.css(`label[for*="${forVal}"]`)).click();
    }
    
    clickContinue() {
        element(by.css('button[class*="submit"]')).click();
    }

}

export class EligibilityPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/prepare');
    }

    clickCheckBox() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    clickModalContinue() {
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
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
        return browser.get('/msp/application/personal-info');
    }

    typeOption(status: string) {
        element(by.css('input[role="combobox"]')).sendKeys(status);
    }

    clickOption(status: string) {
        element(by.css('input[role="combobox"]')).click();
        element(by.cssContainingText('span', `${status}`)).click();
    }

    getInputVal() {
        // return element(by.css('div[class="ng-value"]')).element(by.css('span[class="ng-value-label"]')).getAttribute('value');
        return element(by.css('input[role="combobox"]')).getAttribute('value');
    }
}

export class SpouseInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/spouse-info');
    }
    
}

export class ChildInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/child-info');
    }
    
}

export class ContactInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/address');
    }
    
}

export class ReviewPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/review');
    }
    
}

export class AuthorizePage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/application/authorize');
    }
    
}
