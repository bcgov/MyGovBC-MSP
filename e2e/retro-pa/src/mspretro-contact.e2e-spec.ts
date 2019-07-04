import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspretro-pa.po';
import { onPageLoadTest, onClickStepperTest, onClickContinueTest, onClickConsentModalTest, fillConsentModal } from '../../msp-generic-tests';
import { FakeDataRetroPA } from './mspretro-pa.data';

describe('MSP Retro PA - Contact Info Page', () => {
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

    onPageLoadTest(CONTACT_PAGE_URL);
    onClickStepperTest(CONTACT_PAGE_URL, SPOUSE_PAGE_URL, 'Spouse', 'Review');
    onClickContinueTest(CONTACT_PAGE_URL);

    it('01. should be able to continue when all required fields are filled up', () => {
        contactInfoPage.navigateToURL(CONTACT_PAGE_URL);
        contactInfoPage.fillContactInfoPage(contactInfoData);
        contactInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should navigate to the next page');
    });

});