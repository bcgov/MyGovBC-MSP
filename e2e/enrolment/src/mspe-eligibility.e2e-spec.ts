import { browser, element, by } from 'protractor';
import { EligibilityPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Authorize', () => {
    let page: EligibilityPage;
    const data = new FakeDataEnrolment();
    let eliData;
    const ELIGIBILITY_PAGE_URL = `msp/application/prepare`;
    // const PERSONAL_PAGE_URL = `msp/`

    beforeAll(() => {
        console.log('START OF E2E ENROLMENT' + '\nThis test uses Seed #: ' + data.getSeed());
    });

    beforeEach(() => {
        page = new EligibilityPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL);
    });

    it('02. should NOT let the user to proceed if the user has not agreeed to the info collection notice', () => {
        page.navigateTo();
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL);
        expect(page.checkModal()).toBe('true');
    });

});
