import { browser } from 'protractor';
import { testGenericAllPages, testGenericFirstPage, fillConsentModal } from '../../msp-generic-tests';
import { HomePage } from './mspretro-pa.po';

describe('MSP Retro PA - Home Page:', () => {

    let homePage: HomePage;
    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    
    beforeEach(() => {
        homePage = new HomePage();
    });

    testGenericAllPages(HomePage, HOME_PAGE_URL);
    testGenericFirstPage(HomePage, 'Personal Info', {PAGE_URL: HOME_PAGE_URL, NEXT_PAGE_URL: PERSONAL_PAGE_URL});

    it('01. should let user to continue once they selected a year', () => {
        homePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('02. should let user to continue when more than one year is selected', () => {
        homePage.navigateToURL(HOME_PAGE_URL);
        homePage.fillPageWithMultipleYears();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('03. should let user to check MSP Premium Rates by clicking the link', () => {
        homePage.navigateToURL(HOME_PAGE_URL);
        homePage.checkMSPPremiumRates('2017');
        browser.sleep(5000);
        homePage.isMSPPremiumRatesDisplayed('2017').then(val => {
            expect(val).toBe(true, 'the table should be displayed');
        });
    });

});
