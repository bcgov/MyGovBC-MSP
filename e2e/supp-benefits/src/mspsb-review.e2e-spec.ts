import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testPageLoad, testClickStepper, testSkip, testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Review Page:', () => {
    let page: ReviewPage;
    let personalPage: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;
    const REVIEW_PAGE_URL = `msp/benefit/review`;
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize`;

    beforeEach(() => {
        page = new ReviewPage();
        personalPage = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    testGenericAllPages(ReviewPage, REVIEW_PAGE_URL);
    testGenericSubsequentPage(ReviewPage, {prevLink: 'Contact Info', nextLink: 'Authorize'}, {PAGE_URL: REVIEW_PAGE_URL, PREV_PAGE_URL: CONTACT_PAGE_URL, NEXT_PAGE_URL: AUTHORIZE_PAGE_URL});

    it('01. should let the user to edit information', () => {
        page.navigateTo();
        page.clickPencilIcon('Applicant info');
        personalPage.fillInfo(personalInfoData);
        personalPage.continue();
        page.clickStepper('Review');
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });
});