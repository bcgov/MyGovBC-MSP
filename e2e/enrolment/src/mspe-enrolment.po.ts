import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { ContactPageTest, PersonalInfoPageTest } from './mspe-enrolment.data';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */
export class BaseMSPEnrolmentTestPage extends AbstractTestPage {

    protected diffMailAddressButton: WebElement = element(by.css('.mail-address-container .btn'));
    protected diffMailAddressCheckbox: WebElement = element(by.css('.custom-checkbox .custom-control-label'));

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp');
    }

    selectMSPEnrolment() {
        element(by.cssContainingText('button', 'New MSP enrolment application')).click();
    }

    clickButton(val: string) {
        element(by.cssContainingText('button span', `${val}`)).click();
    }

    clickRadioButtonByName(nameVal: string, forVal: string){
        element(by.css(`common-radio[name^="${nameVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    clickRadioButtonByID(idVal: string, forVal: string){
        element(by.css(`common-radio[id^="${idVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    clickRadioButtonByLabel(labelVal: string, forVal: string){
        element(by.css(`common-radio[label^="${labelVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    clickRadioButtonByLegend(legVal: string, forVal: string){
        element(by.cssContainingText('legend', `${legVal}`)).element(by.xpath('../..')).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    typeName(labelVal: string, text: string) {
        element(by.css(`common-name[label="${labelVal}"] input`)).sendKeys(text);
    }
    
    clickContinue() {
        element(by.css('button[class*="submit"]')).click();
    }

    clickModalContinue() {
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
    }

    clickDiffMailAddress() {
        this.diffMailAddressButton.click();
    }

    checkDiffMailAddress() {
        this.diffMailAddressCheckbox.click();
    }

    clickProgressBar(hrefVal: string){
        element(by.css(`a[href*="${hrefVal}"]`)).element(by.css('span')).click();
    }

    selectDate(labelVal: string, data: PersonalInfoPageTest){
        const month = data.birthDate.getMonth();
        const day = data.birthDate.getDate();
        const year = data.birthDate.getFullYear();

        element(by.css(`common-date[label="${labelVal}"]`)).click();
        element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`option[value="${month}"]`)).click();
        element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`input[id^="day"]`)).sendKeys(day);
        element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`input[id^="year"]`)).sendKeys(year);
    }

    typeText(idVal: string, text: string){
        element(by.css(`input[id^="${idVal}"]`)).sendKeys(text);
        element(by.css(`input[id^="${idVal}"]`)).sendKeys(protractor.Key.ENTER);
    }

}

export class EligibilityPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    fillPage() {
        this.navigateTo();
        this.clickAgree();
        this.clickModalContinue();
        this.clickRadioButtonByName('LiveInBC', 'true');
        this.clickRadioButtonByName('PlannedAbsence', 'false');
        this.clickRadioButtonByName('UnusualCircumstance', 'false');
        this.clickContinue();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/check-eligibility');
    }

    clickAgree() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    clickModalContinue() {
         element(by.cssContainingText('button', 'Continue')).click();
    }

}

export class PersonalInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    fillPage(data: PersonalInfoPageTest) {
        this.clickOption('Your immigration status', 'Canadian citizen');
        this.clickRadioButtonByID('statausReason', '1');
        browser.sleep(1000);
        this.clickRadioButtonByID('statausReason', '1');
        this.scrollDown();
        this.clickOption('Document Type', 'Canadian birth certificate');
        this.clickButton('Add');
        this.scrollDown();
        this.clickRadioButtonByName('NameChangeQuestion', 'false');
        browser.sleep(1000);
        this.uploadFile();
        browser.sleep(1000);
        this.typeName('First name', data.firstName);
        this.scrollDown();
        if(data.middleName){
            this.typeName('Middle name (optional)', data.middleName);
        }
        this.typeName('Last name', data.lastName);
        this.selectDate('Birthdate', data);
        this.clickRadioButtonByLabel('Gender', 'M');
        this.scrollDown();
        this.clickRadioButtonByLegend('Have you moved to B.C. permanently?', 'true');
        this.typeText('province', 'Alberta');
        this.selectDate('Arrival date in B.C.', data);
        this.clickRadioButtonByLegend('Have you been outside B.C. for', 'false');
        this.clickRadioButtonByLegend('Do you have a previous B.C.', 'false');
        this.clickRadioButtonByLegend('Have you been released from', 'false');
        this.clickRadioButtonByLegend('Are you full-time student', 'false');
        this.clickContinue();
    }

    uploadFile(absolutePath = '/space/workspace/MyGovBC-MSP/e2e/sample.jpg') {
        // browser.executeAsyncScript(function(callback) {
        //     document.querySelectorAll('#input-file-element')[0].style.display = 'inline';
        //     callback();
        // });
        element(by.css('common-file-uploader input[type="file"]')).sendKeys(absolutePath); 
    }

    navigateTo() {
        return browser.get('/msp/enrolment/personal-info');
    }

    clickOption(idVal: string, status: string) {
        element(by.css(`input[id^="${idVal}"]`)).click();
        element(by.cssContainingText('ng-dropdown-panel span', `${status}`)).click();
    }

}

export class SpouseInfoPage extends PersonalInfoPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/spouse-info');
    }

    fillPage(data: PersonalInfoPageTest)
    {
        this.clickAddSpouse();
        this.clickOption("Spouse's immigration status in Canada", 'Canadian citizen');
        this.clickRadioButtonByID('statausReason', '1');
        browser.sleep(1000);
        this.clickRadioButtonByID('statausReason', '1');
        this.scrollDown();
        this.clickOption('Document Type', 'Canadian birth certificate');
        this.clickAddDoc();
        this.scrollDown();
        this.clickRadioButtonByName('NameChangeQuestion', 'false');
        browser.sleep(1000);
        this.uploadFile();
        browser.sleep(1000);
        this.typeName('First name', data.firstName);
        this.scrollDown();
        if(data.middleName){
            this.typeName('Middle name (optional)', data.middleName);
        }
        this.typeName('Last name', data.lastName);
        this.selectDate('Birthdate', data);
        this.clickRadioButtonByLabel('Gender', 'M');
        this.scrollDown();
        this.clickRadioButtonByLegend('Have they moved to B.C. permanently?', 'true');
        this.typeText('province', 'Alberta');
        this.selectDate('Arrival date in B.C.', data);
        this.clickRadioButtonByLegend('Have they been outside B.C. for', 'false');
        this.clickRadioButtonByLegend('Do they have a previous B.C.', 'false');
        this.clickRadioButtonByLegend('Have they been released from', 'false');
        this.clickContinue();       
    }

    clickAddSpouse() {
        element(by.cssContainingText('button span', 'Add Spouse')).click();
    }

    clickAddDoc() {
        element(by.css('common-button[label="Add"]')).click();
    }
    
}

export class ChildInfoPage extends PersonalInfoPage {

    constructor() {
        super();
    }

    fillPage(data: PersonalInfoPageTest) {
        this.clickAddChild();
        this.clickRadioButtonByID('AgeCategory', '2');
        browser.sleep(5000);
    }

    clickAddChild() {
        element(by.cssContainingText('button span', 'Add Child')).click();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/child-info');
    }
    
}

export class ContactInfoPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/address');
    }

    fillPage(data: ContactPageTest) {
        this.typeText('street', data.street);
        this.typeText('city', data.city);
        this.typeText('postalCode', data.postal);
        this.typeText('phone', data.mobile);
        this.clickContinue();
    }

    // fillMailingAddress(data: ContactPageTest) {
    //     element(by.css('common-address:nth-child(1) [id^="street"]')).sendKeys(data.address);
    //     element(by.css('common-address:nth-child(1) [id^="city"]')).sendKeys(data.city);
    //     element(by.css('common-address:nth-child(1) [id^="postal"]')).sendKeys(data.postal);
    // }

    // fillContactNumber(data: ContactPageTest) {
    //     element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
    // }

}

export class ReviewPage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/review');
    }

    clickIcon(tagName: string, val: string) {
        element(by.css(`${tagName}[ng-reflect-edit-router-link*="${val}"]`)).element(by.css('i')).click();
    }

}

export class AuthorizePage extends BaseMSPEnrolmentTestPage {

    constructor() {
        super();
    }

    navigateTo() {
        return browser.get('/msp/enrolment/authorize');
    }

    fillPage() {
        this.scrollDown();
        this.checkAgree('applicantAuthorization');
        this.checkHasSpouse().then(val => {
            if(val){
                this.checkAgree('spouseAuthorization');
            }
        });
        this.typeCaptcha();
        this.clickSubmit();
        browser.sleep(10000);
    }

    checkAgree(nameVal: string) {
        element(by.css(`common-checkbox[name="${nameVal}"]`)).element(by.cssContainingText('label', 'Yes, I agree')).click();
    }

    checkHasSpouse() {
        return element(by.css('common-checkbox[name="spouseAuthorization"]')).isPresent();
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

    clickSubmit() {
        element(by.cssContainingText('button', ' Submit Application ')).click();
    }
    
}
