import { browser, element, by } from 'protractor';
import { PreparePage, BaseMSPSuppBenefitsTestPage } from './mspsb-supp-benefits.po';
import { testPageLoad, testClickContinue, testClickNextStepper, testClickConsentModal } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Prepare Page', () => {
    let page: PreparePage;
    const PREPARE_PAGE_URL = `msp/benefit/prepare`
    const PERSONAL_PAGE_URL = `msp/benefit/personal`

    beforeEach(() => {
        page = new PreparePage();
    });

    testPageLoad(PREPARE_PAGE_URL);
    testClickConsentModal(PREPARE_PAGE_URL);
    testClickNextStepper(PREPARE_PAGE_URL, 'Personal Info');
    testClickContinue(PREPARE_PAGE_URL);

    it('01. should NOT let the user continue if all required questions have NOT been answered', () => {
        page.navigateTo();
        page.clickOption('2019');
        page.typeNetIncome('25000');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on the page');
    });

    it('02. should let the user continue if all required questions have been answered', () => {
        page.navigateTo();
        page.clickOption('2018');
        page.typeNetIncome('25000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.scrollDown();
        browser.sleep(5000);
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

});
