import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Personal Info', () => {
    let page: PersonalInfoPage;
    const data = new FakeDataEnrolment();
    let perData;
    const PERSONAL_PAGE_URL = `msp/enrolment/personal-info`;
    const SPOUSE_PAGE_URL = `msp/enrolment/spouse-info`;

    beforeEach(() => {
        page = new PersonalInfoPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('02. should be able to select status by typing it in the field', () => {
        page.navigateTo();
        page.typeOption('Canadian citizen');
        page.getInputVal().then(function(val){
        //    expect(val).toBe('Canadian citizen');
        });
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('03. should be able to select status by clicking it in the field', () => {
        page.navigateTo();
        page.clickOption('Canadian citizen');
        page.getInputVal().then(function(val){
        //    expect(val).toBe('Canadian citizen');
        });
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('04. should be able to continue when user answer all required questions', () => {
        page.navigateTo();
        page.clickOption('Canadian citizen');
        page.clickRadioButton('Your Status in Canada', 'Moved to B.C. from another province');
        page.clickModalContinue();
        page.uploadFile();
        page.clickContinue();
        // expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
        page.formErrors().count().then(function(val) {
            expect(val).toBe(0, 'should be no errors after answering all required questions');
        });
        // browser.sleep(10000);
        
    });

    // TO-DO: Add auto-complete test for status

});
