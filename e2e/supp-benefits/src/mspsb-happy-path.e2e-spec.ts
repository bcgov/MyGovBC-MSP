import { browser } from 'protractor';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { EligibilityPage, PreparePage, PersonalInfoPage, SpouseInfoPage, ContactInfoPage, ReviewPage, AuthorizePage } from './mspsb-supp-benefits.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - End to End Test (Happy Path)', () => {
    let eligibilityPage: EligibilityPage;
    let preparePage: PreparePage;
    let personalPage: PersonalInfoPage;
    let spousePage: SpouseInfoPage;
    let contactPage: ContactInfoPage;
    let reviewPage: ReviewPage;
    let authorizePage: AuthorizePage;

    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    let contactData;

    const ELIGIBILITY_PAGE_URL = `msp/benefit/eligibility`;
    const PREPARE_PAGE_URL = `msp/benefit/financial-info`;
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`;
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;
    const REVIEW_PAGE_URL = `msp/benefit/review`;
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize`;
    const CONFIRMATION_PAGE_URL = `msp/benefit/confirmation?confirmationNum=`;

    beforeEach(() => {
        eligibilityPage = new EligibilityPage();
        preparePage = new PreparePage();
        personalPage = new PersonalInfoPage();
        spousePage = new SpouseInfoPage();
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

    it('01. should navigate from Financial Info Page to Confirmation Page (end-to-end) when all required fields are filled out', () => {
        fillConsentModal(ELIGIBILITY_PAGE_URL);
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should navigate to the Financial Info Page');
        preparePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        reviewPage.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        authorizePage.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

    it('02. should be able to successfully pass test for maximum length for each field', () => {
        let personalInfoData = data.personalInfoMax();
        fillConsentModal(ELIGIBILITY_PAGE_URL);
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should navigate to the Financial Info Page');
        preparePage.fillPage('49999.99');
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        reviewPage.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        authorizePage.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

    it('03. should NOT allow to continue when there is no file upload for POA', () => {
        fillConsentModal(ELIGIBILITY_PAGE_URL);
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should navigate to the Financial Info Page');
        preparePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        reviewPage.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPage();
        authorizePage.checkConsent('authByAttorney');
        authorizePage.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should stay on the same page since file upload is required');
    }, 120000);

    it('04. should NOT uncheck POA and clear file/s attached to it when user checks First Person Authorize', () => {
        fillConsentModal(ELIGIBILITY_PAGE_URL);
        eligibilityPage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should navigate to the Financial Info Page');
        preparePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
        personalPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        spousePage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        contactPage.fillPage(contactData);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        reviewPage.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        authorizePage.fillPOA();
        authorizePage.fillPage();
        authorizePage.checkPOA().then(val => {
            expect(val).toBe(true, 'POA should still be checked');
        });
    }, 120000);

});

