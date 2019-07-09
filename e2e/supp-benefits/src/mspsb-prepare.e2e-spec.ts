import { browser, element, by } from 'protractor';
import { PreparePage } from './mspsb-supp-benefits.po';
import { testGenericFirstPage, testGenericAllPages, fillConsentModal } from '../../msp-generic-tests';

fdescribe('MSP Supplementary Benefits - Prepare Page:', () => {
    let page: PreparePage;
    const PREPARE_PAGE_URL = `msp/benefit/prepare`
    const PERSONAL_PAGE_URL = `msp/benefit/personal`

    beforeEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        page = new PreparePage();
        fillConsentModal(PREPARE_PAGE_URL);
    });

    testGenericAllPages(PreparePage, PREPARE_PAGE_URL);
    testGenericFirstPage(PreparePage, 'Personal Info', {PAGE_URL: PREPARE_PAGE_URL});

    it('01. should NOT let the user continue if all required questions have NOT been answered', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2019');
        page.typeNetIncome('25000');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on the page');
    });

    it('02. should let the user continue if all required questions have been answered', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('25000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('03. should display the sum of the user and spouses income correctly if user has a spouse', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'true');
        page.scrollDown();
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.typeSpouseIncome('10000');
        page.checkHouseholdIncome().then(val => {
            expect(val).toBe('$25,000.00', 'expect that it should be the sum of the user and spouse\'s income');
        });
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('04. should NOT display Spouse disability credit when user click Yes, then check My Spouse, then click No', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'true');
        page.scrollDown();
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.typeSpouseIncome('10000');
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'true');
        page.clickContinueDisabilityCredit();
        page.clickOption('spouseClaimForDisabilityCredit');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.checkSpouseDisabilityCredit().then(val => {
            expect(val).toBe(false, 'expect that spouse disability credit is not visible');
        });
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('05. should NOT display Child deductions when user click Yes, then fill up fields, then click No', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'true');
        page.scrollDown();
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.typeSpouseIncome('10000');
        page.clickRadioButton('Do you have any children', 'true');
        page.typeChildrenCount('2');
        page.typeLine214('5000');
        page.typeLine117('2500');
        page.clickRadioButton('Do you have any children', 'false');
        page.checkChildrenDeduction().then(val => {
            expect(val).toBe(false, 'expect that children deduction is not visible');
        });
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('06. should require user to upload attended care receipts if they click Yes to the last question', () => {
        fillConsentModal(PREPARE_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.scrollDown();
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'true');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PREPARE_PAGE_URL, 'should stay on the same page');
    });

});
