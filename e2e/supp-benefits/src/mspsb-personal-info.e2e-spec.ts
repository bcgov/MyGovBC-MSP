import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';

describe('MSP Supplementary Benefits - Personal Info Page', () => {
    let page: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`

    beforeEach(() => {
        page = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    it('01. should load the page without issue', () => {
        page.navigateTo();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('02. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });
});