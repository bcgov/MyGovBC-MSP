import { browser } from 'protractor';
import { onPageLoadTest, onClickNextStepperTest, onClickContinueTest, onClickConsentModalTest, fillConsentModal } from '../../msp-generic-tests';
import { HomePage } from './mspretro-pa.po';

describe('MSP Retro PA - Home Page', () => {

    let homePage: HomePage;
    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    
    beforeEach(() => {
        homePage = new HomePage();
        fillConsentModal(HOME_PAGE_URL);
    });

    afterEach(() => {
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    onPageLoadTest(HOME_PAGE_URL);
    onClickNextStepperTest(HOME_PAGE_URL, 'Personal Info');
    onClickContinueTest(HOME_PAGE_URL);

    it('01. should let user to continue once they selected a year', () => {
        homePage.fillPage();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('02. should let user to continue when more than one year is selected', () => {
        homePage.fillPageWithMultipleYears();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL);
    });

    it('03. should let user to check MSP Premium Rates by clicking the link', () => {
        homePage.navigateToURL(HOME_PAGE_URL);
        homePage.checkMSPPremiumRates('2017');
        browser.sleep(5000);
        homePage.isMSPPremiumRatesDisplayed('2017').then(function(val) {
            expect(val).toBe(true, 'the table should be displayed');
        });
    });

});
