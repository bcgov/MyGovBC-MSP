
import { browser } from 'protractor';
import { FakeDataACL } from './mspacl.data';
import { RequestPage } from './mspacl.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP ACL Page - E2E TESTS', () => {
    let requestPage: RequestPage;
    const data = new FakeDataACL;
    let personalInfoData;
    const REQUEST_ACL_PAGE_URL = `msp/account-letter/request-acl`;
    const CONFIRMATION_PAGE_URL = `msp/account-letter/confirmation`;

    beforeEach(() => {
        requestPage = new RequestPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    it('01. should check for validations of each field and should not let continue of there are any invalid fields', () => {
        requestPage.fillModal();
        requestPage.typeText('phn', '1234567890');
        requestPage.checkDisplayError('Personal Health Number (PHN) is invalid.').then(val => {
          expect(val).toBe(true, 'PHN error should be displayed');
        });
        requestPage.typeDate('Birthdate', '1', '0', '1990');
        requestPage.checkDisplayError('Invalid Birthdate.').then(val => {
          expect(val).toBe(true, 'Birthdate error should be displayed');
        });
        requestPage.continue();
        requestPage.checkDisplayError('Mailing Postal Code is required.').then(val => {
          expect(val).toBe(true, 'Postal Code error should be displayed'); // postal code validation
        });
    }, 120000);

    it('02. should get an error if the first PHN is the same as the second one', () => {
        requestPage.fillModal();
        requestPage.typeText('phn', '9999999998');
        requestPage.scrollDown();
        requestPage.clickRadioButton('EnrolmentMembership', 'S');
        requestPage.typePHNForSpecificMember('9999999998');
        requestPage.checkDisplayError('Personal Health Number (PHN) was already used for another family member.').then(val => {
          expect(val).toBe(true, 'PHN error should be displayed');
        });
    }, 120000);

    it('03. should NOT be able to continue if the required fields are NOT filled out', () => {
        requestPage.fillModal();
        requestPage.continue();
        expect(browser.getCurrentUrl()).toContain(REQUEST_ACL_PAGE_URL, 'should NOT be able to succesfully submit the form');
    }, 120000);

    it('04. should NOT be able to continue if the captcha is NOT filled out', () => {
        requestPage.fillModal();
        requestPage.typeText('phn', personalInfoData.PHN.toString());
        requestPage.selectDate('Birthdate', personalInfoData);
        requestPage.typeText('postal', personalInfoData.postal);
        requestPage.scrollDown();
        requestPage.clickRadioButton('EnrolmentMembership', 'M');
        requestPage.continue();
        browser.sleep(5000);
        expect(browser.getCurrentUrl()).toContain(REQUEST_ACL_PAGE_URL, 'should NOT be able to succesfully submit the form');
    }, 120000);
});