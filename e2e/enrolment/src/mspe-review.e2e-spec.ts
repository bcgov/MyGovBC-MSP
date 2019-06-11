import { browser, element, by } from 'protractor';
import { ReviewPage, PersonalInfoPage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

describe('MSP Enrolment - Review', () => {
    let page: ReviewPage;
    let personalPage: PersonalInfoPage;
    const data = new FakeDataEnrolment();
    const REVIEW_PAGE_URL = `msp/enrolment/review`;
    const AUTHORIZE_PAGE_URL = `msp/enrolment/authorize`;

    beforeEach(() => {
        page = new ReviewPage();
        personalPage = new PersonalInfoPage();
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

    it('03. should be able to edit/modify info', () => {
        page.navigateTo();
        page.clickIcon('msp-person-card', 'personal-info');
        personalPage.clickOption('Canadian citizen');
        personalPage.clickRadioButton('Your Status in Canada', 'Moved to B.C. from another province');
        personalPage.clickModalContinue();
        browser.sleep(1000);
        personalPage.clickProgressBar('review');
        page.clickContinue();
        expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL);
    });

});
