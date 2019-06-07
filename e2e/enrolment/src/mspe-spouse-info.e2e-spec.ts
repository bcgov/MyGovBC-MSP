import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Spouse Info', () => {
    let page: SpouseInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const SPOUSE_PAGE_URL = `msp/application/spouse-info`;
    const CHILD_PAGE_URL = `msp/application/child-info`;

    beforeEach(() => {
        page = new SpouseInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });

});
