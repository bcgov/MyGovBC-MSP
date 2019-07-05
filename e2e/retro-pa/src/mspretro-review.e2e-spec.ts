import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspretro-pa.po';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { testPageLoad, testClickStepper, testSkip } from '../../msp-generic-tests';

describe('MSP Retro PA - Review Page', () => {
    let page: ReviewPage;
    let personalPage: PersonalInfoPage;
    const data = new FakeDataRetroPA;
    let personalInfoData;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;
    const REVIEW_PAGE_URL = `msp/benefit/review`;
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize-submit`;

    beforeEach(() => {
        page = new ReviewPage();
        personalPage = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    testPageLoad(REVIEW_PAGE_URL);
    testClickStepper(REVIEW_PAGE_URL, CONTACT_PAGE_URL, 'Contact Info', 'Authorize');
    testSkip(REVIEW_PAGE_URL, AUTHORIZE_PAGE_URL);

    // Pages still not finish
    xit('01. should let the user to edit information', () => {
        page.navigateTo();
        page.clickPencilIcon('Applicant info');
        personalPage.fillPersonalInfoPage(personalInfoData);
        personalPage.continue();
        page.clickStepper('Review');
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });
});