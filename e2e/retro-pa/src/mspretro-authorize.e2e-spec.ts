import { browser, element, by } from 'protractor';
import { AuthorizePage } from './mspretro-pa.po';
import { testPageLoad,  testClickContinue, testClickPrevStepper, testGenericAllPages, testGenericLastPage } from '../../msp-generic-tests';

describe('MSP Retro PA - Authorize Page:', () => {
    let authorizePage: AuthorizePage;
    const REVIEW_PAGE_URL = `msp/assistance/review`;
    const AUTHORIZE_PAGE_URL = `msp/assistance/authorize-submit`;
    const CONFIRMATION_PAGE_URL = `msp/assistance/confirmation`;

    beforeEach(() => {
        authorizePage = new AuthorizePage();
    });

    testGenericAllPages(AuthorizePage, AUTHORIZE_PAGE_URL);
    testGenericLastPage(AuthorizePage, 'Review', {PAGE_URL: AUTHORIZE_PAGE_URL, PREV_PAGE_URL: CONFIRMATION_PAGE_URL});
    // testPageLoad(AUTHORIZE_PAGE_URL);
    // testClickPrevStepper(AUTHORIZE_PAGE_URL, REVIEW_PAGE_URL, 'Review');
    // testClickContinue(AUTHORIZE_PAGE_URL);

    it('01. should let user to continue when they select authorize by applicant', () => {
        authorizePage.navigateToURL(AUTHORIZE_PAGE_URL);
        authorizePage.checkConsent('firstPersonAuthorize');
        authorizePage.typeCaptcha();
        authorizePage.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page');
    });

    it('02. should let user to continue when they select authorize by attorney', () => {
        authorizePage.navigateToURL(AUTHORIZE_PAGE_URL);
        authorizePage.checkConsent('authByAttorney');
        authorizePage.uploadOneFile();
        authorizePage.typeCaptcha();
        authorizePage.continue();
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should navigate to confirmation page');
    });

});