import { browser, element, by } from 'protractor';
import { ReviewPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Review', () => {
    let page: ReviewPage;
    const data = new FakeDataEnrolment();
    let perData;
    const REVIEW_PAGE_URL = `msp/application/review`;
    const AUTHORIZE_PAGE_URL = `msp/application/authorize`;

    beforeEach(() => {
        page = new ReviewPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL);
    });

});
