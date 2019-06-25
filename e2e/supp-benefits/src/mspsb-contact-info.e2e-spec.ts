import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';

describe('MSP Supplementary Benefits - Contact Info', () => {

    let page: ContactInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let contactData;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;
    const REVIEW_PAGE_URL = `msp/benefit/review`;

    beforeEach(() => {
        page = new ContactInfoPage();
        contactData = data.contactInfo();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });

    it('02. should let the user continue when all required fields are filled out', () => {
        page.navigateTo();
        page.fillAddress(contactData);
        page.clickDiffMailAddress();
        page.fillMailingAddress(contactData);
        page.fillContactNumber(contactData);
        // Province field is currently not working
        page.formErrors().count().then(function(val) {
            expect(val).toBe(0, 'should be no errors after filling out all required fields - EXPECT TO FAIL');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the Review page - EXPECT TO FAIL');
        
    });

    it('03. should NOT let users continue with an incomplete address', () => {
        contactData['city'] = '';
        page.navigateTo();
        page.fillAddress(contactData);
        page.clickDiffMailAddress();
        page.fillMailingAddress(contactData);
        page.fillContactNumber(contactData);
        // Province field is currently not working
        page.formErrors().count().then(function(val) {
            expect(val).toBe(2, 'should be two errors in city field for address & mailing address - EXPECT TO FAIL');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
    });

    it('04. should let users partially fill out a mailing address but uncheck it, and continue', () => {
        page.navigateTo();
        page.fillAddress(contactData);
        page.clickDiffMailAddress();
        contactData['city'] = '';
        page.fillMailingAddress(contactData);
        page.checkDiffMailAddress();
        page.fillContactNumber(contactData);
        page.formErrors().count().then(function(val) {
            expect(val).toBe(0, 'should have no errors even though city is not filled out in mailing address');
        });
        page.continue();
        // Province field is currently not working
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the Review page - EXPECT TO FAIL');
    });

});
