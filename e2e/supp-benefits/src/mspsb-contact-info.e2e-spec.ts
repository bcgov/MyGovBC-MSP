import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testPageLoad, testClickContinue, testClickStepper } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Contact Info', () => {

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

    testPageLoad(CONTACT_PAGE_URL);
    testClickStepper(CONTACT_PAGE_URL, SPOUSE_PAGE_URL, 'Spouse Info', 'Review');
    testClickContinue(CONTACT_PAGE_URL);

    it('01. should let the user continue when all required fields are filled out', () => {
        page.navigateTo();
        page.fillAddress(contactData);
        page.fillContactNumber(contactData);
        page.formErrors().count().then(function(val) {
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
        page.formErrors().count().then(function(val) {
            expect(val).toBe(1, 'should be two errors in city field for address');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
    });

});
