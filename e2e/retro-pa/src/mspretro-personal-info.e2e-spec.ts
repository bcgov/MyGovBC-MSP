import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspretro-pa.po';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { onPageLoadTest, onClickStepperTest, onClickContinueTest, onClickConsentModalTest, fillConsentModal } from '../../msp-generic-tests';

describe('MSP Retro PA - Personal Info Page', () => {
    let personalInfoPage: PersonalInfoPage;
    const data = new FakeDataRetroPA;
    let personalInfoData;
    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    const SPOUSE_PAGE_URL = `msp/assistance/spouse`;

    beforeEach(() => {
        personalInfoPage = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
        fillConsentModal(HOME_PAGE_URL);
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    onPageLoadTest(PERSONAL_PAGE_URL);
    onClickStepperTest(PERSONAL_PAGE_URL, HOME_PAGE_URL, 'Home', 'Spouse');
    onClickContinueTest(PERSONAL_PAGE_URL);

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