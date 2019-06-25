import { browser, element, by } from 'protractor';
import { AuthorizePage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';

describe('MSP Enrolment - Authorize', () => {
    let page: AuthorizePage;
    const data = new FakeDataSupplementaryBenefits();
   
    const AUTHORIZE_PAGE_URL = `msp/benefit/authorize`;
    const CONFIRMATION_PAGE_URL = `msp/benefit/confirmation`;

    beforeEach(() => {
        page = new AuthorizePage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });

    it('02. should let user to continue when they select authorize by applicant', () => {
        page.navigateTo();
        page.checkConsent('firstPersonAuthorize');
        page.typeCaptcha();
        page.continue();
        // This will fail because continue button is not working yet
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page - EXPECT TO FAIL');
    });

    it('03. should let user to continue when they select authorize by attorney', () => {
        page.navigateTo();
        page.checkConsent('authByAttorney');
        page.uploadFile();
        page.typeCaptcha();
        page.continue();
        // This will fail because continue button is not working yet
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page - EXPECT TO FAIL');
    });

});
