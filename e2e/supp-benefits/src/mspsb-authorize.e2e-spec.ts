import { browser, element, by } from 'protractor';
import { AuthorizePage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericLastPage, testGenericAllPages } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Authorize Page:', () => {
    let page: AuthorizePage;
    const data = new FakeDataSupplementaryBenefits();
   
    const REVIEW_PAGE_URL = `msp/benefit/review`;
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize`;
    const CONFIRMATION_PAGE_URL = `msp/benefit/confirmation?confirmationNum=`;

    beforeEach(() => {
        page = new AuthorizePage();
        data.setSeed();
    });

    testGenericAllPages(AuthorizePage, AUTHORIZE_PAGE_URL);
    testGenericLastPage(AuthorizePage, 'Review', {PAGE_URL: AUTHORIZE_PAGE_URL, PREV_PAGE_URL: REVIEW_PAGE_URL});

    it('01. should let user to continue when they select authorize by applicant', () => {
        page.navigateTo();
        page.checkConsent('firstPersonAuthorize');
        page.typeCaptcha();
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page');
    });

    it('02. should let user to continue when they select authorize by attorney', () => {
        page.navigateTo();
        page.checkConsent('authByAttorney');
        page.uploadOneFile();
        page.typeCaptcha();
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page');
    });

});
