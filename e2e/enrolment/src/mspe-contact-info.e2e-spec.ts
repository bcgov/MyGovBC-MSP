import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Contact Info', () => {

    let page: ContactInfoPage;
    const data = new FakeDataEnrolment();
    let contactData;
    const CONTACT_PAGE_URL = `msp/enrolment/address`;
    const REVIEW_PAGE_URL = `msp/enrolment/review`;

    beforeEach(() => {
        page = new ContactInfoPage();
        contactData = data.contactInfo();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });

    // Country and Province fields are not currently working right now
    xit('02. should let users set their own mailing address by filling out the Mailling Address field', () => {
        page.navigateTo();
        page.scrollDown();
        page.clickDiffMailAddress();
        page.fillMailingAddress(contactData);
        page.fillContactNumber(contactData);
        page.continue();

        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the Review page');
        page.formErrors().count().then(function(val) {
            expect(val).toBe(0, 'should be no errors after filling out all required fields');
        });
    });

    // Country and Province fields are not currently working right now
    xit('03. should NOT let users continue with an incomplete mailing address', () => {
        page.navigateTo();
        page.scrollDown();
        page.clickDiffMailAddress();
        page.fillContactNumber(contactData);
        page.continue();

        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
        page.formErrors().count().then(function(val) {
            expect(val).toBe(3, 'should have 3 errors for incomplete address');
        });
    });

    // Country and Province fields are not currently working right now
    xit('04. should let users partially fill out a mailing address but uncheck it, and continue', () => {
        page.navigateTo();
        page.scrollDown();
        page.clickDiffMailAddress();
        page.fillMailingAddress(contactData);
        page.checkDiffMailAddress();
        page.fillContactNumber(contactData);
        page.continue();
        
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the Review page');
        page.formErrors().count().then(function(val) {
            expect(val).toBe(3, 'should have 3 errors for incomplete address');
        });
    });

});
