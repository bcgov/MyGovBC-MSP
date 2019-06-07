import { browser, element, by } from 'protractor';
import { ContactInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Contact Info', () => {
    let page: ContactInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const CONTACT_PAGE_URL = `msp/application/address`;
    const REVIEW_PAGE_URL = `msp/application/review`;

    beforeEach(() => {
        page = new ContactInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });

});
