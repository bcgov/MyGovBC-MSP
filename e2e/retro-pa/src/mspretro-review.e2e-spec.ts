import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspretro-pa.po';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { testPageLoad, testClickStepper, testSkip, testGenericAllPages, testGenericSubsequentPage } from '../../msp-generic-tests';

describe('MSP Retro PA - Review Page:', () => {
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

    testGenericAllPages(ReviewPage, REVIEW_PAGE_URL);
    testGenericSubsequentPage(ReviewPage, {prevLink: 'Contact', nextLink: 'Authorize Submit'}, {PAGE_URL: REVIEW_PAGE_URL, PREV_PAGE_URL: CONTACT_PAGE_URL, NEXT_PAGE_URL: AUTHORIZE_PAGE_URL});
    
     // Will only work if the previous pages are filled out
    xit('01. should let the user to edit information', () => {
        page.navigateTo();
        page.clickPencilIcon('Personal info');
        personalPage.fillPersonalInfoPage(personalInfoData);
        personalPage.continue();
        page.clickStepper('Review');
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });
});