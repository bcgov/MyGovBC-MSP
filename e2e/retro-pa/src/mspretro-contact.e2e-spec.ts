import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspretro-pa.po';
import { testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { SpouseComponent } from 'app/modules/assistance/pages/spouse/spouse.component';

describe('MSP Retro PA - Contact Info Page:', () => {
    let contactInfoPage: ContactInfoPage;
    const data = new FakeDataRetroPA;
    let contactInfoData;
    const SPOUSE_PAGE_URL = `msp/assistance/spouse`;
    const CONTACT_PAGE_URL = `msp/assistance/contact`;
    const REVIEW_PAGE_URL = `msp/assistance/review`;

    beforeEach(() => {
        contactInfoPage = new ContactInfoPage();
        contactInfoData = data.contactInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(ContactInfoPage, CONTACT_PAGE_URL);
    testGenericSubsequentPage(ContactInfoPage, {prevLink: 'Spouse', nextLink: 'Review'}, {PAGE_URL: CONTACT_PAGE_URL, PREV_PAGE_URL: SPOUSE_PAGE_URL, NEXT_PAGE_URL: REVIEW_PAGE_URL});

    // Will only work if the previous pages are filled out
    it('01. should be able to continue when all required fields are filled up', () => {
        contactInfoPage.navigateToURL(CONTACT_PAGE_URL);
        contactInfoPage.fillContactInfoPage(contactInfoData);
        contactInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the next page');
    });

    // New tests from TEST feedback
    it('02. should capture invalid postal codes thru postal code validation if country is Canada', () => {
        contactInfoData.country = 'Canada';
        contactInfoData.postal = 'ABC123'
        contactInfoPage.navigateToURL(CONTACT_PAGE_URL);
        contactInfoPage.fillContactInfoPage(contactInfoData);
        contactInfoPage.checkErrorDisplayed('Must be in the format A1A 1A1.').then(val => {
            expect(val).toBe(true, 'expect the invalid postal code error should display');
        });
        contactInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
    });

    it('03. should allow non-Canadian format for postal code validation if country is NOT Canada', () => {
        contactInfoData.country = 'United States';
        contactInfoData.postal = 'ABC123'
        contactInfoPage.navigateToURL(CONTACT_PAGE_URL);
        contactInfoPage.fillContactInfoPage(contactInfoData);
        contactInfoPage.getPostalCodeInput().then(val => {
            expect(val).toBe('ABC123', 'expect the postal value and input field value are the same');
        });
        contactInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should stay on the same page');
    });

});