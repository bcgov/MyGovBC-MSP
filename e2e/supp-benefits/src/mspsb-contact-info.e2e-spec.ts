import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Contact Info:', () => {

    let page: ContactInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let contactData;
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;
    const REVIEW_PAGE_URL = `msp/benefit/review`;

    beforeEach(() => {
        page = new ContactInfoPage();
        contactData = data.contactInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(ContactInfoPage, CONTACT_PAGE_URL);
    testGenericSubsequentPage(ContactInfoPage, {prevLink: 'Spouse Info', nextLink: 'Review'}, {PAGE_URL: CONTACT_PAGE_URL, PREV_PAGE_URL: SPOUSE_PAGE_URL, NEXT_PAGE_URL: REVIEW_PAGE_URL});

    it('01. should let the user continue when all required fields are filled out', () => {
        page.navigateTo();
        page.fillAddress(contactData);
        page.fillContactNumber(contactData);
        page.formErrors().count().then(val => {
            expect(val).toBe(0, 'should be no errors after filling out all required fields');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the Review page');
        
    });

    it('02. should NOT let users continue with an incomplete address', () => {
        contactData['city'] = '';
        page.navigateTo();
        page.fillAddress(contactData);
        page.fillContactNumber(contactData);
        page.formErrors().count().then(val => {
            expect(val).toBe(1, 'should be two errors in city field for address');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
    });

    it('03. should be able to add and remove an address line', () => {
        page.navigateTo();
        page.clickIcon('plus');
        page.checkAddressLine2().then(val => {
            expect(val).toBe(true, 'Address Line 2 should be present');
        });
        page.clickIcon('minus');
        page.checkAddressLine2().then(val => {
            expect(val).toBe(false, 'Address Line 2 should be hidden');
        });
    });

});
