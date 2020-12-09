import { browser, by, element, WebElement, protractor, Key } from "protractor";
import { AbstractTestPage } from "moh-common-lib/e2e";
import { ContactPageTest, PersonalInfoPageTest } from "./mspac-account.data";

export class BaseMSPAccountChangeTestPage extends AbstractTestPage {
  protected diffMailAddressButton: WebElement = element(by.css(".mail-address-container .btn"));
  protected diffMailAddressCheckbox: WebElement = element(by.css(".custom-checkbox .custom-control-label"));

  monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"  
  ];

  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp");
  }

  selectMSPAccountChange() {
    element(by.cssContainingText("button", "New MSP Account Change Request")).click();
  }

  clickButton(val: string) {
    element(by.css(`common-button[ng-reflect-label="${val}"]`))
      .element(by.cssContainingText("span", `${val}`))
      .click();
  }

  clickRadioButton(labelVal: string, forVal: string) {
    element(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`))
      .element(by.css(`label[for*="${forVal}"]`))
      .click();
  }

  clickContinue() {
    element(by.css('button[class*="submit"]')).click();
  }

  clickModalContinue() {
    element(by.css('div[class="modal-footer"]'))
      .element(by.css('button[type="submit"]'))
      .click();
  }

  clickDiffMailAddress() {
    this.diffMailAddressButton.click();
  }

  checkDiffMailAddress() {
    this.diffMailAddressCheckbox.click();
  }

  clickProgressBar(hrefVal: string) {
    element(by.css(`a[href*="${hrefVal}"]`))
      .element(by.css("span"))
      .click();
  }
}

export class HomePage extends BaseMSPAccountChangeTestPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/home");
  }

  clickCheckBox() {
    element(by.css('label[for="agree"]')).element(by.css("strong")).click();
  }

  checkModal() {
    return element(by.css("common-consent-modal"))
      .element(by.css('div[aria-labelledby="myLargeModalLabel"]'))
      .isDisplayed();
  }
}

export class PersonalInfoPage extends BaseMSPAccountChangeTestPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/personal-info");
  }

  fillPersonalInfo(data: PersonalInfoPageTest) {
    element(by.css('common-name[label="First name"]')).sendKeys(data.firstName);
    element(by.css('common-name[label="Last name"]')).sendKeys(data.lastName);
    element(by.css('common-phn')).sendKeys(data.healthNum);
    this.clickOption(this.monthNames[data.birthDate.getMonth()]);
    element(by.css('input[placeholder="day"]')).sendKeys(data.birthDate.getDay());
    element(by.css('input[placeholder="year"]')).sendKeys(data.birthDate.getFullYear());
  }

  typeOption(status: string) {
    element(by.css('input[role="combobox"]')).sendKeys(status);
    element(by.css('input[role="combobox"]')).sendKeys(protractor.Key.ENTER);
  }

  clickOption(status: string) {
    element(by.css('input[role="combobox"]')).click();
    element(by.cssContainingText("span", `${status}`)).click();
  }

  getInputVal() {
    return element(by.css('input[role="combobox"]')).getAttribute("value");
  }

  clickRadioButton(ariaVal: string, labelVal: string) {
    element(by.css(`div[aria-label*="${ariaVal}"]`))
      .element(by.cssContainingText("label", `${labelVal}`))
      .click();
  }

  // Sample file : file:///space/workspace/MyGovBC-MSP/e2e/sample.jpg
  uploadFile(absolutePath = "/space/workspace/MyGovBC-MSP/e2e/sample.jpg") {
    element(by.css('common-file-uploader input[type="file"]')).sendKeys(absolutePath);
  }
}

export class SpouseInfoPage extends PersonalInfoPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/spouse-info");
  }
}

export class ChildInfoPage extends PersonalInfoPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/child-info");
  }
}

export class ContactInfoPage extends BaseMSPAccountChangeTestPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/contact-info");
  }

  fillMailingAddress(data: ContactPageTest) {
    element(by.css('common-address:nth-child(1) [id^="street"]')).sendKeys(data.address);
    element(by.css('common-address:nth-child(1) [id^="city"]')).sendKeys(data.city);
    element(by.css('common-address:nth-child(1) [id^="postal"]')).sendKeys(data.postal);
  }

  fillContactNumber(data: ContactPageTest) {
    element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
  }
}

export class ReviewPage extends BaseMSPAccountChangeTestPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/review");
  }

  clickIcon(tagName: string, val: string) {
    element(by.css(`${tagName}[ng-reflect-edit-router-link*="${val}"]`))
      .element(by.css("i"))
      .click();
  }
}

export class AuthorizePage extends BaseMSPAccountChangeTestPage {
  constructor() {
    super();
  }

  navigateTo() {
    return browser.get("/msp/deam/authorize");
  }

  checkAgree() {
    element(by.css('common-checkbox[ng-reflect-label*="Yes"]'))
      .element(by.css("input"))
      .click();
  }
}
