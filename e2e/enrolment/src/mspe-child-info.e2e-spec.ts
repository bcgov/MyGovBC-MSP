import { browser, element, by } from 'protractor';
import { ChildInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Child Info', () => {
    let page: ChildInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const CHILD_PAGE_URL = `msp/enrolment/child-info`;
    const CONTACT_PAGE_URL = `msp/enrolment/address`;

    beforeEach(() => {
        page = new ChildInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL);
    });

    it('02. should be able to continue when user has no children', () => {
        page.navigateTo();
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should navigate to the next page');
    });

    it('03. should be able to add child/children', () => {
        page.navigateTo();
        page.clickButton('Add Child');
        page.typeOption('Canadian citizen');
        page.clickRadioButton('Child\'s Status in Canada', 'Moved to B.C. from another province');
        // Remove comment below once File Upload is working
        // page.uploadFile();
        // page.clickContinue();
        // expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
        page.formErrors().count().then(val => {
            expect(val).toBe(0, 'should be no errors after answering all required questions');
        });
    });

});