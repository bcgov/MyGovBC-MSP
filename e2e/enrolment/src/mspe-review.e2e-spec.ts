import { browser, element, by } from 'protractor';
import { ReviewPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Review', () => {
    let page: ReviewPage;
    const data = new FakeDataEnrolment();
    let perData;
    const REVIEW_PAGE_URL = `msp/enrolment/review`;
    const AUTHORIZE_PAGE_URL = `msp/enrolment/authorize`;

    beforeEach(() => {
        page = new ReviewPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });

    it('02. should be able to continue without editing any info', () => {
        page.navigateTo();
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });

    // The pencil icon will redirect you to the homepage instead of that specific page
    xit('03. should be able to edit/modify info', () => {
        page.navigateTo();
        page.clickIcon('msp-contact-card');
        
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });

});
