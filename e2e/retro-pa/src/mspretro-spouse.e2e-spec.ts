import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspretro-pa.po';
import { testPageLoad, testClickStepper, testClickContinue, testClickConsentModal, fillConsentModal, testGenericAllPages, testGenericSubsequentPage } from '../../msp-generic-tests';
import { FakeDataRetroPA } from './mspretro-pa.data';

describe('MSP Retro PA - Spouse Info Page:', () => {
    let spouseInfoPage: SpouseInfoPage;
    const data = new FakeDataRetroPA;
    let personalInfoData;
    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    const SPOUSE_PAGE_URL = `msp/assistance/spouse`;
    const CONTACT_PAGE_URL = `msp/assistance/contact`;

    beforeEach(() => {
        spouseInfoPage = new SpouseInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
        fillConsentModal(HOME_PAGE_URL);
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(SpouseInfoPage, SPOUSE_PAGE_URL);
    testGenericSubsequentPage(SpouseInfoPage, {prevLink: 'Personal Info', nextLink: 'Contact'}, {PAGE_URL: SPOUSE_PAGE_URL, PREV_PAGE_URL: PERSONAL_PAGE_URL, NEXT_PAGE_URL: CONTACT_PAGE_URL});

    // This page depends on the inputs from the home page
    it('01. should be able to add spouse, fill out the page and continue', () => {
        spouseInfoPage.fillPage();
        spouseInfoPage.fillPersonalInfoPage(personalInfoData);
        spouseInfoPage.fillSpouseInfoPage();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should navigate to the next page');
    });

    it('02. should NOT let user to continue if there is at least one incomplete field', () => {
        spouseInfoPage.fillPage();
        spouseInfoPage.fillPersonalInfoPage(personalInfoData);
        spouseInfoPage.clickButton('btn', 'Add Spouse');
        spouseInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should stay on the same page');
    });

});;