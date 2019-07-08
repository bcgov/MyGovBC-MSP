import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testPageLoad, testClickStepper, testSkip, genDescribe } from '../../msp-generic-tests';

fdescribe('MSP Supplementary Benefits - Review Page', () => {
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

    // genDescribe(REVIEW_PAGE_URL, new ReviewPage());
    genDescribe(ReviewPage,  {PAGE_URL: REVIEW_PAGE_URL, NEXT_PAGE_URL: AUTHORIZE_PAGE_URL});

    // testPageLoad(REVIEW_PAGE_URL);
    // testClickStepper(REVIEW_PAGE_URL, CONTACT_PAGE_URL, 'Contact Info', 'Authorize');
    // testSkip(REVIEW_PAGE_URL, AUTHORIZE_PAGE_URL);

    // it('01. should let the user to edit information', () => {
    //     page.navigateTo();
    //     page.clickPencilIcon('Applicant info');
    //     personalPage.fillInfo(personalInfoData);
    //     personalPage.continue();
    //     page.clickStepper('Review');
    //     browser.sleep(2000);
    //     expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    // });
});