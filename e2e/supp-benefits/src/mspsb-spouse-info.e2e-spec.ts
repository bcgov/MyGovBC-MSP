import { browser, element, by } from 'protractor';
import { SpouseInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';

describe('MSP Supplementary Benefits - Spouse Info Page', () => {
    let page: SpouseInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let spouseInfoData;
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`;
    const CONTACT_PAGE_URL = `msp/benefit/contact-info`;

    beforeEach(() => {
        page = new SpouseInfoPage();
        spouseInfoData = data.personalInfo();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });

    it('02. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.addSpouse();
        page.fillInfo(spouseInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL);
    });
});