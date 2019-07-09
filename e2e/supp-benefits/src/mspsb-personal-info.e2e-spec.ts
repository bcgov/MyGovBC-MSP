import { browser, element, by } from 'protractor';
import { PersonalInfoPage } from './mspsb-supp-benefits.po';
import { FakeDataSupplementaryBenefits } from './mspsb-supp-benefits.data';
import { testGenericSubsequentPage, testGenericAllPages } from '../../msp-generic-tests';

describe('MSP Supplementary Benefits - Personal Info Page:', () => {
    let page: PersonalInfoPage;
    const data = new FakeDataSupplementaryBenefits;
    let personalInfoData;
    const PREPARE_PAGE_URL = `msp/benefit/prepare`
    const PERSONAL_PAGE_URL = `msp/benefit/personal-info`
    const SPOUSE_PAGE_URL = `msp/benefit/spouse-info`

    beforeEach(() => {
        page = new PersonalInfoPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    testGenericAllPages(PersonalInfoPage, PERSONAL_PAGE_URL);
    testGenericSubsequentPage(PersonalInfoPage, {prevLink: 'Prepare', nextLink: 'Spouse Info'}, {PAGE_URL: PERSONAL_PAGE_URL, PREV_PAGE_URL: SPOUSE_PAGE_URL, NEXT_PAGE_URL: PREPARE_PAGE_URL});

    it('01. should fill out the required fields and click continue', () => {
        page.navigateTo();
        page.fillInfo(personalInfoData);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL);
    });
});