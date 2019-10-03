import { browser } from 'protractor';
import { FakeDataEnrolment } from './mspe-enrolment.data';
import { EligibilityPage, PersonalInfoPage } from './mspe-enrolment.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP Enrolment Page - End to End Test (Happy Path)', () => {
    let eligibilityPage: EligibilityPage;
    let personalPage: PersonalInfoPage;
    // let spousePage: SpouseInfoPage;
    // let contactPage: ContactInfoPage;
    // let reviewPage: ReviewPage;
    // let authorizePage: AuthorizePage;

    const data = new FakeDataEnrolment;
    let personalInfoData;
    // let contactData;

    // const ELIGIBILITY_PAGE_URL = `msp/enrolment/check-eligibility`;
    const PERSONAL_PAGE_URL = `msp/enrolment/personal-info`;
    const SPOUSE_PAGE_URL = `msp/enrolment/spouse-info`;

    beforeEach(() => {
        eligibilityPage = new EligibilityPage();
        personalPage = new PersonalInfoPage();
        // spousePage = new SpouseInfoPage();
        // contactPage = new ContactInfoPage();
        // reviewPage = new ReviewPage();
        // authorizePage = new AuthorizePage();
        personalInfoData = data.personalInfo();
        // contactData = data.contactInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    it('01. should navigate Check Eligibility Page to Authorize Page successfully', () => {
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        // spousePage.fillPage(personalInfoData);
        // expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        // contactPage.fillPage(contactData);
        // expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        // reviewPage.continue();
        // expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        // authorizePage.fillPage();
        // authorizePage.continue();
        // expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

});