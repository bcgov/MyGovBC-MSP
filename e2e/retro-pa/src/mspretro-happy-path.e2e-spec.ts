import { browser } from 'protractor';
import { FakeDataRetroPA } from './mspretro-pa.data';
import { HomePage, PersonalInfoPage, SpouseInfoPage, ContactInfoPage, ReviewPage, AuthorizePage } from './mspretro-pa.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP Retro PA - End to End Test (Happy Path)', () => {
    let homePage: HomePage;
    let personalPage: PersonalInfoPage;
    let spousePage: SpouseInfoPage;
    let contactPage: ContactInfoPage;
    let reviewPage: ReviewPage;
    let authorizePage: AuthorizePage;

    const data = new FakeDataRetroPA;
    let personalInfoData;
    let contactData;

    const HOME_PAGE_URL = `msp/assistance/home`;
    const PERSONAL_PAGE_URL = `msp/assistance/personal-info`;
    const SPOUSE_PAGE_URL = `msp/assistance/spouse`;
    const CONTACT_PAGE_URL = `msp/assistance/contact`;
    const REVIEW_PAGE_URL = `msp/assistance/review`;
    const AUTHORIZE_PAGE_URL = `msp/assistance/authorize-submit`;

    beforeEach(() => {
        homePage = new HomePage();
        // personalPage = new PersonalInfoPage();
        // spousePage = new SpouseInfoPage();
        // contactPage = new ContactInfoPage();
        // reviewPage = new ReviewPage();
        // authorizePage = new AuthorizePage();
        // personalInfoData = data.personalInfo();
        // contactData = data.contactInfo();
        data.setSeed();
    });

    it('Should navigate from Home page to Confirmation Page (end-to-end) when all required fields are filled out', () => {
        // fillConsentModal(HOME_PAGE_URL);
        // expect(browser.getCurrentUrl()).toContain(HOME_PAGE_URL, 'should navigate to the Home Page');
        // homePage.fillPage();
        // expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
        // personalPage.fillPersonalInfoPage(personalInfoData);
        // personalPage.continue();
        // expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
        // spousePage.fillSpouseInfoPage();
        // expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
        // contactPage.fillContactInfoPage(contactData);
        // expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
        // reviewPage.continue();
        // expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
        // authorizePage.fillPage();
        // expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);

    // it('should be able to successfully pass test for maximum length for each field', () => {
    //     let personalInfoData = data.personalInfoMax();
    //     fillConsentModal(HOME_PAGE_URL);
    //     expect(browser.getCurrentUrl()).toContain(HOME_PAGE_URL, 'should navigate to the Home Page');
    //     homePage.fillPage();
    //     expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should continue to the Personal Info Page');
    //     personalPage.fillPersonalInfoPage(personalInfoData);
    //     personalPage.continue();
    //     expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should continue to the Spouse Info Page');
    //     spousePage.fillSpouseInfoPage();
    //     expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, 'should continue to the Contact Info Page');
    //     contactPage.fillContactInfoPage(contactData);
    //     expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, 'should continue to the Review Page');
    //     reviewPage.continue();
    //     expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should contunue to the Authorization Page');
    //     authorizePage.fillPage();
    //     expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, 'should be able to succesfully submit the form');
    // }, 120000);

});

