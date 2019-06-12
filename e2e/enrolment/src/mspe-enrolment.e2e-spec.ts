import { browser, element, by } from 'protractor';
import { SpouseInfoPage, EligibilityPage, ChildInfoPage, ContactInfoPage, PersonalInfoPage, ReviewPage, AuthorizePage } from './mspe-enrolment.po';
import { FakeDataEnrolment } from './mspe-enrolment.data';

fdescribe('MSP Enrolment - End-to-End', () => {
    let eligibilityPage: EligibilityPage;
    let personalPage: PersonalInfoPage;
    let spousePage: SpouseInfoPage;
    let childPage: ChildInfoPage;
    let contactPage: ContactInfoPage;
    let reviewPage: ReviewPage;
    let authorizePage: AuthorizePage;

    const data = new FakeDataEnrolment();
    let contactData;
    const PERSONAL_PAGE_URL = `msp/enrolment/personal-info`;
    const SPOUSE_PAGE_URL = `msp/enrolment/spouse-info`;
    const CHILD_PAGE_URL = `msp/enrolment/child-info`;
    const CONTACT_PAGE_URL = `msp/enrolment/address`;
    const REVIEW_PAGE_URL = `msp/enrolment/review`;
    const AUTHORIZE_PAGE_URL = `msp/enrolment/authorize`;
    const SENDING_PAGE_URL = `msp/enrolment/sending`;

    beforeEach(() => {
        eligibilityPage = new EligibilityPage();
        personalPage = new PersonalInfoPage();
        spousePage = new SpouseInfoPage();
        childPage = new ChildInfoPage();
        contactPage = new ContactInfoPage();
        reviewPage = new ReviewPage();
        authorizePage = new AuthorizePage();

        contactData = data.contactInfo();
        data.setSeed();
    });

    it('01. should be able to navigate from end to end - no spouse and no children', () => {
        eligibilityPage.navigateTo();
        eligibilityPage.clickCheckBox();
        eligibilityPage.clickModalContinue();
        eligibilityPage.clickRadioButton('Do you currently live in Briti', 'true');
        eligibilityPage.clickRadioButton('Will you or anyone in your imm', 'false');
        eligibilityPage.clickRadioButton('Is anyone you\'re applying for', 'false');
        eligibilityPage.clickContinue();
        expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, 'should navigate to the next page');
        personalPage.clickOption('Canadian citizen');
        personalPage.clickRadioButton('Your Status in Canada', 'Moved to B.C. from another province');
        personalPage.clickModalContinue();
        // Insert upload file method here, comment the method below once this method is working
        personalPage.clickProgressBar('spouse-info');
        expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, 'should navigate to the next page');
        spousePage.clickContinue();
        childPage.clickContinue();
        // Country and Province fields are not currently working right now, comment the method method once it's working
        contactPage.clickProgressBar('review');
        reviewPage.clickContinue();






    });

});
