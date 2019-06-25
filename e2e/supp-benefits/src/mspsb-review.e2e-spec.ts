import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';

describe('MSP Supplementary Benefits - Spouse Info Page', () => {
    let page: ReviewPage;
    let personalPage: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const REVIEW_PAGE_URL = `msp/benefit/review`;
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize`;

    beforeEach(() => {
        page = new ReviewPage();
        personalPage = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });

    it('02. should let the user continue without having any changes', () => {
        page.navigateTo();
        page.continue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });

    it('03. should let the user to edit information', () => {
        page.navigateTo();
        page.clickPencilIcon('Applicant info');
        personalPage.fillInfo(personalInfoData);
        personalPage.continue();
        page.clickStepper('Review');
        browser.sleep(2000);
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });
});