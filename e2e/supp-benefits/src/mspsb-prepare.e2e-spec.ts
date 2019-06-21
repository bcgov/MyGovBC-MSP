import { browser, element, by } from 'protractor';
import { PreparePage, BaseMSPSuppBenefitsTestPage } from './mspsb-supp-benefits.po';

describe('MSP Supplementary Benefits - Prepare Page', () => {
    let page: PreparePage;
    const PREPARE_PAGE_URL = `msp/benefit/prepare`
    const PERSONAL_PAGE_URL = `msp/benefit/personal`

    beforeAll(() => {
        // console.log('START OF E2E ENROLMENT' + '\nThis test uses Seed #: ' + data.getSeed());
    });

    beforeEach(() => {
        page = new PreparePage();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo()
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL);
    });

    it('02. should NOT let the user to proceed if the user has not agreeed to the info collection notice', () => {
        page.navigateTo();
        page.clickConsentModalContinue();
        page.checkConsentModal().then(function(val) {
            expect(val).toBe(true);
        });
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on page');
    });

    it('03. should let the user to proceed if the user has agreeed to the info collection notice', () => {
        page.navigateTo();
        page.agreeConsentModal();
        page.clickConsentModalContinue();
        page.checkConsentModal().then(function(val) {
            expect(val).toBe(false);
        });
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on the page');
    });

    it('04. should NOT let the user continue if all required questions have been answered', () => {
        page.navigateTo();
        page.clickOption('st.year-0');
        page.typeNetIncome('25000');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on the page');
    });

    it('05. should let the user continue if all required questions have been answered', () => {
        page.navigateTo();
        page.clickOption('st.year-0');
        page.typeNetIncome('25000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.clickRadioButton('Do you have any children', 'false');
        page.scrollDown();
        page.clickRadioButton('Did anyone included in your MS', 'false');
        // page.clickRadioButton('Did anyone included in your MS', 'false'); // duplicate labels
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

});
