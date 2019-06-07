import { browser, element, by } from 'protractor';
import { ChildInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

fdescribe('MSP Enrolment - Child Info', () => {
    let page: ChildInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const CHILD_PAGE_URL = `msp/application/child-info`;
    const CONTACT_PAGE_URL = `msp/application/contact-info`;

    beforeEach(() => {
        page = new ChildInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL);
    });

});