import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspretro-pa.po';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { testPageLoad, testClickStepper, testClickContinue, testClickConsentModal, fillConsentModal, testGenericAllPages, testGenericSubsequentPage } from '../../msp-generic-tests';

describe('MSP Retro PA - Personal Info Page:', () => {
    let personalInfoPage: PersonalInfoPage;
    const data = new FakeDataRetroPA;
    let personalInfoData;
    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    const SPOUSE_PAGE_URL = `msp/assistance/spouse`;

    beforeEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        personalInfoPage = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
        fillConsentModal(HOME_PAGE_URL);
    });

    testGenericAllPages(PersonalInfoPage, PERSONAL_PAGE_URL);
    testGenericSubsequentPage(PersonalInfoPage, {prevLink: 'Home', nextLink: 'Spouse'}, {PAGE_URL: PERSONAL_PAGE_URL, PREV_PAGE_URL: HOME_PAGE_URL, NEXT_PAGE_URL: SPOUSE_PAGE_URL});

    // This page depends on the inputs from the home page
    it('01. should fill out the required fields and click continue', () => {
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should navigate to the next page');
    });

    it('02. should be able to upload multiple files (if multiple years were selected) and click continue', () => {
        personalInfoPage.fillPageWithMultipleYears();
        personalInfoPage.fillPersonalInfo(personalInfoData);
        personalInfoPage.uploadMultipleFiles(personalInfoPage.START_YEAR, personalInfoPage.END_YEAR);
        personalInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should navigate to the next page');
    });

    it('03. should NOT let user continue if there is at least one incomplete field', () => {
        personalInfoData.lastName = '';
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });
});