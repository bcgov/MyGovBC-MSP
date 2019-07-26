import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';
import { p } from '@angular/core/src/render3';

describe('MSP Supplementary Benefits - Personal Info Page:', () => {
    let page: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const FINANCIAL_PAGE_URL = `msp/benefit/financial-info`
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`

    beforeEach(() => {
        page = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testGenericAllPages(PersonalInfoPage, PERSONAL_PAGE_URL);
    testGenericSubsequentPage(PersonalInfoPage, {prevLink: 'Financial Info', nextLink: 'Spouse Info'}, {PAGE_URL: PERSONAL_PAGE_URL, PREV_PAGE_URL: FINANCIAL_PAGE_URL, NEXT_PAGE_URL: SPOUSE_PAGE_URL});

    it('01. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });

    it('02. should capture invalid PHN', () => {
        personalInfoData.PHN = '1234567890';
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    // New tests from TEST feedback
    it('03. should capture invalid SINs', () => {
        const sampleSIN = ['000000000', '-999999999', '123456789'];
        personalInfoData.SIN = sampleSIN[Math.floor(Math.random() * 3)];
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.checkErrorDisplayed('SIN is not in the correct format').then(val => {
            expect(val).toBe(true, 'expect the invalid SIN error should be displayed');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should stay on the same page');
    });

    it('04. should capture valid SINs', () => {
        const sampleSIN = ['574268660', '637351180', '448719799'];
        personalInfoData.SIN = sampleSIN[Math.floor(Math.random() * 3)];
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.checkErrorDisplayed('Social Insurance Number (SIN) is invalid.').then(val => {
            expect(val).toBe(false, 'expect the SIN is valid');
        });
        page.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should navigate to the next page');
    });
});