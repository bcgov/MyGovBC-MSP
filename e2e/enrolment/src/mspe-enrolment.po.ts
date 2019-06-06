import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { ProfilePageTest, ContactPageTest } from './mspe-enrolment.data';
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

    clickContinue() {
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
    }

    checkModal() {
        return element(by.css('div[class="modal-dialog"]')).isDisplayed().toString;
    }

}