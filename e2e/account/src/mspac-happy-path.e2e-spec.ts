import { browser, element, by } from "protractor";
import {
  SpouseInfoPage,
  HomePage,
  ChildInfoPage,
  ContactInfoPage,
  PersonalInfoPage,
  ReviewPage,
  AuthorizePage,
} from "./mspac-account.po";
import { FakeDataAccountChange } from "./mspac-account.data";

describe("MSP AccountChange - End-to-End", () => {
  let homePage: HomePage;
  let personalPage: PersonalInfoPage;
  let spousePage: SpouseInfoPage;
  let childPage: ChildInfoPage;
  let contactPage: ContactInfoPage;
  let reviewPage: ReviewPage;
  let authorizePage: AuthorizePage;

  const data = new FakeDataAccountChange();
  let contactData;
  let personalData;
  const PERSONAL_PAGE_URL = `msp/deam/personal-info`;
  const SPOUSE_PAGE_URL = `msp/deam/spouse-info`;
  const CHILD_PAGE_URL = `msp/deam/child-info`;
  const CONTACT_PAGE_URL = `msp/deam/contact-info`;
  const REVIEW_PAGE_URL = `msp/deam/review`;
  const AUTHORIZE_PAGE_URL = `msp/deam/authorize`;

  beforeEach(() => {
    homePage = new HomePage();
    personalPage = new PersonalInfoPage();
    spousePage = new SpouseInfoPage();
    childPage = new ChildInfoPage();
    contactPage = new ContactInfoPage();
    reviewPage = new ReviewPage();
    authorizePage = new AuthorizePage();

    contactData = data.contactInfo();
    personalData = data.personalInfo();
    data.setSeed();
  });

  it("01. should be able to navigate from end to end - no updates, no spouse, and no children", () => {
    homePage.navigateTo();
    homePage.clickCheckBox();
    homePage.clickModalContinue();
    element(by.cssContainingText("span", "Manage Account")).click();
    expect(browser.getCurrentUrl()).toContain(PERSONAL_PAGE_URL, "should navigate to the next page");
    // personalPage.fillPersonalInfo(personalData);
    personalPage.clickRadioButton("As the Account Holder, are you requesting an update to your personal information or renewing your status in Canada?", "No");
    personalPage.clickContinue();
    expect(browser.getCurrentUrl()).toContain(SPOUSE_PAGE_URL, "should navigate to the next page");
    spousePage.clickContinue();
    expect(browser.getCurrentUrl()).toContain(CHILD_PAGE_URL, "should navigate to the next page");
    childPage.clickContinue();
    expect(browser.getCurrentUrl()).toContain(CONTACT_PAGE_URL, "should navigate to the next page");
    contactPage.fillMailingAddress(contactData);
    contactPage.clickContinue();
    expect(browser.getCurrentUrl()).toContain(REVIEW_PAGE_URL, "should navigate to the next page");
    reviewPage.clickContinue();
    expect(browser.getCurrentUrl()).toContain(AUTHORIZE_PAGE_URL, "should navigate to the next page");
    authorizePage.checkAgree();
    // Fill in captcha with irobot
    authorizePage.typeText('answer', 'irobot');
    authorizePage.clickContinue();
  });
});
