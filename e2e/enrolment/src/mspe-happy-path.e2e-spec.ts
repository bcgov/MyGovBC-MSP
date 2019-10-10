import { browser } from 'protractor';
import { FakeDataEnrolment } from './mspe-enrolment.data';
import { EligibilityPage, PersonalInfoPage, SpouseInfoPage, ChildInfoPage, ContactInfoPage, ReviewPage, AuthorizePage } from './mspe-enrolment.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP Enrolment Page - End to End Test (Happy Path)', () => {
    let eligibilityPage: EligibilityPage;
    let personalPage: PersonalInfoPage;
    let spousePage: SpouseInfoPage;
    let childPage: ChildInfoPage;
    let contactPage: ContactInfoPage;
    let reviewPage: ReviewPage;
    let authorizePage: AuthorizePage;

    const data = new FakeDataEnrolment;
    let personalInfoData;
    let contactData;

    // const ELIGIBILITY_PAGE_URL = `msp/enrolment/check-eligibility`;
    const PERSONAL_PAGE_URL = `msp/enrolment/personal-info`;
    const SPOUSE_PAGE_URL = `msp/enrolment/spouse-info`;
    const CHILD_PAGE_URL = `msp/enrolment/child-info`;
    const CONTACT_PAGE_URL = `msp/enrolment/contact-info`;
    const REVIEW_PAGE_URL = `msp/enrolment/review`;
    const AUTHORIZE_PAGE_URL = `msp/enrolment/authorize`;
    const CONFIRMATION_PAGE_URL = `msp/enrolment/confirmation`;

    beforeEach(() => {
        eligibilityPage = new EligibilityPage();
        personalPage = new PersonalInfoPage();
        spousePage = new SpouseInfoPage();
        childPage = new ChildInfoPage();
        contactPage = new ContactInfoPage();
        reviewPage = new ReviewPage();
        authorizePage = new AuthorizePage();
        personalInfoData = data.personalInfo();
        contactData = data.contactInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    it('01. should navigate Check Eligibility Page to Authorize Page in the shortest way possible', () => {
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL, 'should continue to the Child Info Page');
        childPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        browser.sleep(1000);
        reviewPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

   it('02. should submit successfully if user has spouse', () => {
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL, 'should continue to the Child Info Page');
        childPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        browser.sleep(1000);
        reviewPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

    fit('03. should submit successfully if user has spouse', () => {
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL, 'should continue to the Child Info Page');
        childPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        browser.sleep(1000);
        reviewPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

});