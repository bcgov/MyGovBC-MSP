import { browser, element, by } from 'protractor';
import { EligibilityPage, BaseMSPEnrolmentTestPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Check Eligibility', () => {
    let page: EligibilityPage;
    let basePage: BaseMSPEnrolmentTestPage;
    const data = new FakeDataEnrolment();
    let eliData;
    const ELIGIBILITY_PAGE_URL = `msp/enrolment/prepare`
    const PERSONAL_PAGE_URL = `msp/enrolment/personal-info`;

    beforeAll(() => {
        console.log('START OF E2E ENROLMENT' + '\nThis test uses Seed #: ' + data.getSeed());
    });

    beforeEach(() => {
        page = new EligibilityPage();
        basePage = new BaseMSPEnrolmentTestPage();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo()
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL);
    });

    it('02. should NOT let the user to proceed if the user has not agreeed to the info collection notice', () => {
        page.navigateTo();
        page.clickModalContinue();
        page.checkModal().then(val => {
            expect(val).toBe(true);
        });
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL, 'should stay on page');
    });

    it('03. should let the user to proceed if the user has agreeed to the info collection notice', () => {
        page.navigateTo();
        page.clickCheckBox();
        page.clickModalContinue();
        page.checkModal().then(val => {
            expect(val).toBe(false);
        });
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL, 'should stay on page');
    });

    it('04. should NOT let the user continue if not all questions have been answered', () => {
        basePage.navigateTo();
        basePage.selectMSPEnrolment();
        page.clickCheckBox();
        page.clickModalContinue();
        page.clickContinue();
        // TODO: insert expect that checks if there are errors in the page
        expect(browser.getCurrentUrl()).toContain(ELIGIBILITY_PAGE_URL, 'should stay on page since there are errors');
    });

    it('05. should be able to continue after answering all the questions', () => {
        // Need to go to base page when modal is clicked previously
        basePage.navigateTo();
        basePage.selectMSPEnrolment();
        page.clickCheckBox();
        page.clickModalContinue();
        page.clickRadioButton('Do you currently live in Briti', 'true');
        page.clickRadioButton('Will you or anyone in your imm', 'false');
        page.clickRadioButton('Is anyone you\'re applying for', 'false');
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });
});
