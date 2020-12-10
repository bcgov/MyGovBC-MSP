import { browser, element, by } from 'protractor';
import { AuthorizePage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Authorize', () => {
    let page: AuthorizePage;
    const data = new FakeDataEnrolment();
    let perData;
    const AUTHORIZE_PAGE_URL = `msp/enrolment/authorize`;
    const SENDING_PAGE_URL = `msp/enrolment/sending`;

    beforeEach(() => {
        page = new AuthorizePage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });

    // Problem: How to bypass captcha in e2e testing
    it('02. should let user to continue when they agree', () => {
        page.navigateTo();
        page.checkAgree();
        // Missing method to write captcha using e2e here
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });
});
