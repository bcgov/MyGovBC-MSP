import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspretro-pa.po';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { fillConsentModal, testGenericAllPages, testGenericSubsequentPage } from '../../msp-generic-tests';

describe('MSP Retro PA - Personal Info Page:', () => {
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

    testGenericAllPages(PersonalInfoPage, PERSONAL_PAGE_URL);
    testGenericSubsequentPage(PersonalInfoPage, {prevLink: 'Home', nextLink: 'Spouse'}, {PAGE_URL: PERSONAL_PAGE_URL, PREV_PAGE_URL: HOME_PAGE_URL, NEXT_PAGE_URL: SPOUSE_PAGE_URL});

    // This page depends on the inputs from the home page
    it('01. should fill out the required fields and click continue', () => {
        personalInfoPage.fillPage();
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.continue();
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
        personalInfoPage.fillPage();
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    // New tests from TEST Feedback
    it('04. should NOT allow name fields to have numbers and other characters (RPA #1) - EXPECT TO FAIL', () => {
        personalInfoData.firstName = '1First!';
        personalInfoData.middleName = '2Middle@';
        personalInfoData.lastName = '3Last#';
        personalInfoPage.fillPage();
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.continue();
        personalInfoPage.checkErrorDisplayed('Please provide valid first name.').then(val => {
            expect(val).toBe(true, 'expect the invalid first name error should be displayed');
        });
        personalInfoPage.checkErrorDisplayed('Please provide valid middle name.').then(val => {
            expect(val).toBe(true, 'expect the invalid middle name error should be displayed');
        });
        personalInfoPage.checkErrorDisplayed('Please provide valid last name.').then(val => {
            expect(val).toBe(true, 'expect the invalid last name error should be displayed');
        });
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    it('05. should NOT allow name to have unlimited characters (RPA #2) - EXPECT TO FAIL', () => {
        personalInfoData.firstName = 'Lorem ipsum dolor sit amets consectetur adipiscing elits sed do eiusmod tempor incididunt ut labores';
        personalInfoData.middleName = 'Lorem ipsum dolor sit amets consectetur adipiscing elits sed do eiusmod tempor incididunt ut labores';
        personalInfoData.lastName = 'Lorem ipsum dolor sit amets consectetur adipiscing elits sed do eiusmod tempor incididunt ut labores';
        personalInfoPage.fillPage();
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.getNameInput('firstName').then(val => {
            expect(val.length).toBe(30, 'expected value of First Name input should be 30 (max length)')
        });
        personalInfoPage.getNameInput('middleName').then(val => {
            expect(val.length).toBe(30, 'expected value of Middle Name input should be 30 (max length)')
        });
        personalInfoPage.getNameInput('lastName').then(val => {
            expect(val.length).toBe(30, 'expected value of Last Name input should be 30 (max length)')
        });    
    });

    it('06. should NOT allow invalid/unrealistic values for dates (RPA #3)', () => {
        personalInfoData.birthDate = undefined;
        personalInfoPage.fillPage();
        const month = 2;
        const day = 90;
        const year = 2019;
        element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
        personalInfoPage.typeText('day', day.toString());
        personalInfoPage.typeText('year', year.toString());
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.checkErrorDisplayed('Invalid Date of Birth.').then(val => {
            expect(val).toBe(true, 'expect the invalid date error will display');
        });
        browser.sleep(5000);
        personalInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    it('06. should NOT allow futuristic values for dates (RPA #3)', () => {
        personalInfoData.birthDate = undefined;
        personalInfoPage.fillPage();
        const month = 2;
        const day = 9;
        const year = 2030;
        element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
        personalInfoPage.typeText('day', day.toString());
        personalInfoPage.typeText('year', year.toString());
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.checkErrorDisplayed('Invalid Date of Birth.').then(val => {
            expect(val).toBe(true, 'expect the invalid date error will display');
        });
        browser.sleep(5000);
        personalInfoPage.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    it('08. should show Birth Date inline error when user does not fill out the Birth Date field correctly', () => {
        personalInfoData.birthDate = undefined;
        personalInfoPage.fillPage();
        personalInfoPage.fillPersonalInfoPage(personalInfoData);
        personalInfoPage.checkErrorDisplayed('Date of Birth is required.').then(val => {
            expect(val).toBe(true, 'expect the birth date inline error will display');
        });
    });

   
});