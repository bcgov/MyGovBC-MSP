import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testPageLoad, testClickStepper, testSkip } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Spouse Info Page', () => {
    let page: SpouseInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let spouseInfoData;
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`;
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;

    beforeEach(() => {
        page = new SpouseInfoPage();
        spouseInfoData = data.personalInfo();
        data.setSeed();
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    testPageLoad(SPOUSE_PAGE_URL);
    testClickStepper(SPOUSE_PAGE_URL, PERSONAL_PAGE_URL, 'Personal Info', 'Contact Info');
    testSkip(SPOUSE_PAGE_URL, CONTACT_PAGE_URL);

    it('01. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.addSpouse();
        page.fillInfo(spouseInfoData);
        browser.sleep(10000);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });
});