import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericAllPages, testGenericSubsequentPage } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Spouse Info Page:', () => {
    let page: SpouseInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let spouseInfoData;
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`;
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;

    beforeEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
        page = new SpouseInfoPage();
        spouseInfoData = data.personalInfo();
        data.setSeed();
    });

    testGenericAllPages(SpouseInfoPage, SPOUSE_PAGE_URL);
    testGenericSubsequentPage(SpouseInfoPage, {prevLink: 'Personal Info', nextLink: 'Contact Info'}, {PAGE_URL: SPOUSE_PAGE_URL, PREV_PAGE_URL: PERSONAL_PAGE_URL, NEXT_PAGE_URL: CONTACT_PAGE_URL});

    it('01. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.addSpouse();
        page.fillInfo(spouseInfoData);
        browser.sleep(10000);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });
});