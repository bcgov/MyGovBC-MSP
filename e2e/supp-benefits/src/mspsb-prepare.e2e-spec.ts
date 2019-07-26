import { browser, element, by } from 'protractor';
import { PreparePage } from './mspsb-supp-benefits.po';
import { testGenericFirstPage, testGenericAllPages, fillConsentModal } from '../../msp-generic-tests';
import { validateBirthdate } from 'app/modules/msp-core/models/validate-birthdate';

describe('MSP Supplementary Benefits - Prepare Page:', () => {
    let page: PreparePage;
    const FINANCIAL_PAGE_URL = `msp/benefit/financial-info`;
    const PERSONAL_PAGE_URL = `msp/benefit/personal`
    const TITLE_HEADER = 'Medical Services Plan (MSP) - Supplementary Benefits';

    beforeEach(() => {
        page = new PreparePage();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(PreparePage, FINANCIAL_PAGE_URL);
    testGenericFirstPage(PreparePage, 'Personal Info', {PAGE_URL: FINANCIAL_PAGE_URL});

    it('01. should NOT let the user continue if all required questions have NOT been answered', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2019');
        page.typeNetIncome('25000');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(FINANCIAL_PAGE_URL, 'should stay on the page');
    });

    it('02. should let the user continue if all required questions have been answered', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('03. should display the sum of the user and spouses income correctly if user has a spouse', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have a spouse or common', 'true');
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.typeSpouseIncome('10000');
        page.checkHouseholdIncome().then(val => {
            expect(val).toBe('$25,000.00', 'expect that it should be the sum of the user and spouse\'s income');
        });
        page.scrollDown();
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('04. should NOT display Spouse disability credit when user click Yes, then check My Spouse, then click No', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have a spouse or common', 'true');
        page.clickRadioButton('Is your spouse/common-law part', 'false');
        page.typeSpouseIncome('10000');
        page.clickRadioButton('Do you have any children', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'true');
        page.clickContinueDisabilityCredit();
        page.scrollDown();
        browser.sleep(5000);
        page.clickOption('spouseClaimForDisabilityCredit');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.checkSpouseDisabilityCredit().then(val => {
            expect(val).toBe(false, 'expect that spouse disability credit is not visible');
        });
        browser.sleep(5000);
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('05. should NOT display Child deductions when user click Yes, then fill up fields, then click No', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have a spouse or common', 'true');
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
        browser.sleep(10000);
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'false');
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
    });

    it('06. should require user to upload attended care receipts if they click Yes to the last question', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.clickRadioButton('Do you have any children on yo', 'false');
        page.clickRadioButton('Did anyone included in your MS', 'false');
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'true');
        browser.sleep(5000);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(FINANCIAL_PAGE_URL, 'should stay on the same page');
    });

    // New tests from TEST feedback
    it('07. should check if the title of the header of the page is correct', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.checkTitleHeader().then(val => {
            expect(val).toBe(TITLE_HEADER, 'should display the correct title for the header');
        });
    });

    it('08. number of children in nursing home credit section cannot be more than entered in Children section', () => {
        fillConsentModal(FINANCIAL_PAGE_URL);
        page.clickOption('2018');
        page.typeNetIncome('15000');
        page.clickRadioButton('Are you 65 or older this year?', 'false');
        page.scrollDown();
        page.clickRadioButton('Do you have a spouse or common', 'false');
        page.clickRadioButton('Do you have any children', 'true');
        page.typeChildrenCount('8');
        page.typeLine214('5000');
        page.typeLine117('2500');
        page.scrollDown();
        page.clickRadioButton('Did anyone included in your MS', 'true');
        page.clickContinueDisabilityCredit();
        page.typeChildWithDisabilityCount('9');
        page.getChildCountValue('childrenCount').then(val => {
            page.getChildCountValue('childWithDisabilityCount').then(val2 => {
                expect(val >= val2).toBe(true, 'children count must be >= children disability count');
            });
        });
        page.scrollDown();
        page.clickRadioButtonDuplicate('Did anyone included in your MS', 'true');
        page.scrollDown();
        page.clickOption('childClaimForAttendantCareExpense');
        page.typeChildClaimCount('15');
        page.getChildCountValue('childrenCount').then(valA => {
            page.getChildCountValue('childClaimForAttendantCareExpenseCount').then(valB => {
                expect(valA >= valB).toBe(true, 'children count must be >= children claim for attendant count');
            });
        });
    });

});
