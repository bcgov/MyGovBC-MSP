import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Spouse Info', () => {
    let page: SpouseInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const SPOUSE_PAGE_URL = `msp/enrolment/spouse-info`;
    const CHILD_PAGE_URL = `msp/enrolment/child-info`;

    beforeEach(() => {
        page = new SpouseInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
        page.formErrors().count().then(val => {
            expect(val).toBe(0, 'should be no errors on page load');
        });
    });

    it('02. should be able to skip when user has no spouse', () => {
        page.navigateTo();
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL, 'should navigate to the next page');
    });

    it('03. should be able to add spouse', () => {
        page.navigateTo();
        page.clickButton('Add Spouse');
        page.typeOption('Canadian citizen');
        page.clickRadioButton('Spouse\'s Status in Canada', 'Moved to B.C. from another province');
        page.clickModalContinue();
        // Remove comment below once File Upload is working
        // page.uploadFile();
        // page.clickContinue();
        // expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL);
        page.formErrors().count().then(val => {
            expect(val).toBe(0, 'should be no errors after answering all required questions');
        });
    });

});
