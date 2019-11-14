import { browser, by, element, protractor, Key } from 'protractor';
import { PersonalInfoPageTest, ContactInfoPageTest } from './mspsb-supp-benefits.data';
import { BaseMSPTestPage } from '../../msp.po';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */

export class EligibilityPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/eligibility');
    }

    fillPage() {
        this.clickRadioButton('Do you meet the residency requ', 'true');
        this.continue();
    }

}

export class PreparePage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/financial-info');
    }

    fillPage(amount?: string){
        if(amount === undefined){
            amount = '15000';
        }
        this.clickOption('2018');
        this.typeNetIncome(amount);
        this.clickRadioButton('Are you 65 or older?', 'false');
        this.scrollDown();
        this.clickRadioButton('Do you have a spouse or common', 'true');
        this.clickRadioButton('Is your spouse 65 or older?', 'false');
        this.typeSpouseIncome(amount);
        this.scrollDown();
        this.clickRadioButton('Do you have any children', 'false');
        this.clickRadioButton('Did anyone on your Medical Ser', 'false');
        this.clickRadioButton('Does anyone on your Medical Se', 'false');
        this.clickRadioButtonDuplicate('Did anyone on your Medical Ser', 'false');
        this.continue();
    }

    typeNetIncome(val: string) {
        element(by.css('input[id="netIncome"]')).sendKeys(val);
    }

    typeSpouseIncome(val : string) {
        element(by.css('input[id="spouseIncomeLine236"]')).sendKeys(val);
    }

    typeChildrenCount(val: string) {
        element(by.css('input[id="childrenCount"]')).sendKeys(val);
    }

    typeChildWithDisabilityCount(val: string) {
        element(by.css('input[id="childWithDisabilityCount"]')).sendKeys(val);
    }

    typeChildClaimCount(val: string) {
        element(by.css('input[id="childClaimForAttendantCareExpenseCount"]')).clear();
        element(by.css('input[id="childClaimForAttendantCareExpenseCount"]')).sendKeys(val);
    }

    typeLine214(val: string) {
        element(by.css('input[id="line214"]')).sendKeys(val);
    }

    typeLine117(val: string) {
        element(by.css('input[id="line117"]')).sendKeys(val);
    }

    clickRadioButtonDuplicate(labelVal: string, forVal: string){
        element.all(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).last().element(by.css(`label[for*="${forVal}"]`)).click();
    }

    checkHouseholdIncome() {
        return element(by.cssContainingText('span' , 'Total household income')).element(by.xpath('../..')).element(by.css('td[class*="padding"] span')).getText();  
    }

    clickContinueDisabilityCredit() {
        element(by.cssContainingText('button', 'Yes, continue')).click();
    }

    checkSpouseDisabilityCredit() {
        return element(by.cssContainingText('td', 'Spouse disability credit')).isPresent();
    }

    checkChildrenDeduction() {
        return element(by.cssContainingText('td', 'Children')).isPresent();
    }

    getChildCountValue(idVal: string) {
        return element(by.css(`input[id="${idVal}"]`)).getAttribute('value');
    }

    clickMyChild() {
        element(by.css('label[for="childClaimForAttendantCareExpense"]')).click();
    }

}

export class PersonalInfoPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/personal-info');
    }

    fillPage(personalInfoData: PersonalInfoPageTest) {
        this.fillInfo(personalInfoData);
        this.continue();
    }

    fillInfo(info: PersonalInfoPageTest) {
        this.typeName('first_name', info.firstName);
        if(info.middleName){
            this.typeName('middle_name', info.middleName);
        }
        this.typeName('last_name', info.lastName);
        var month = info.birthDate.getMonth();
        const year = info.birthDate.getFullYear();
        const day = info.birthDate.getDate();
        browser.sleep(1000);
        if(!month){ // If month has been assigned an invalid month, assign a valid one (1)
            month = 1;
        }
        element.all(by.css(`select[id*="month"] option`)).get(month).click();
        this.typeTextUsingID('day', day.toString());
        this.typeTextUsingID('year', year.toString());
        this.scrollDown();
        element.all(by.css('common-phn input')).sendKeys(info.PHN.toString());
        element.all(by.css('common-sin input')).sendKeys(info.SIN.toString());
        this.uploadOneFile();
    }

    checkFileUpload() {
        return element(by.css('common-file-uploader common-thumbnail')).isDisplayed();
    }

    typeTextUsingID(idVal: string, text: string) {
        element(by.css(`input[id*="${idVal}"]`)).sendKeys(text);
    }

}

export class SpouseInfoPage extends PersonalInfoPage {

    navigateTo() {
        return browser.get('/msp/benefit/spouse-info');
    }

    fillPage(spouseInfoData: PersonalInfoPageTest) {
        spouseInfoData.PHN = 9898293823;
        spouseInfoData.SIN = 358745768;
        browser.sleep(2000);
        this.addSpouse();
        this.fillInfo(spouseInfoData);
        browser.sleep(3000);
        this.continue();
    }

    addSpouse() {
        element(by.cssContainingText('button', 'Add Spouse Information')).click();
    }

}

export class ContactInfoPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/contact-info');
    }

    fillPage(contactData: ContactInfoPageTest) {
        this.fillAddress(contactData);
        this.scrollDown();
        this.fillContactNumber(contactData);
        this.continue();
    }

    fillAddress(data: ContactInfoPageTest) {
        element.all(by.css('common-country input')).sendKeys(data.country);
        element.all(by.css('common-country input')).sendKeys(protractor.Key.ENTER);
        element.all(by.css('common-province input')).sendKeys(data.province);
        element.all(by.css('common-street input')).sendKeys(data.address);
        element.all(by.css('common-city input')).sendKeys(data.city);
        element.all(by.css('common-postal-code input')).sendKeys(data.postal);
    }

    fillContactNumber(data: ContactInfoPageTest) {
        element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
    }

    clickIcon(classVal: string){
        element(by.css(`button i[class*="${classVal}"]`)).click();
    }

    checkAddressLine2(){
        return element(by.css('common-street[label="Address Line 2"]')).isPresent();
    }

    checkAddressLine3(){
        return element(by.css('common-street[label="Address Line 3"]')).isPresent();
    }

    checkProvince(){
        return element(by.css('common-province input')).getAttribute('value');
    }
}

export class ReviewPage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/review');
    }

}

export class AuthorizePage extends BaseMSPTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/authorize');
    }

    fillPage() {
        this.checkConsent('firstPersonAuthorize');
        this.checkHasSpouse().then(val => {
            if(val){
                this.checkConsent('secondPersonAuthorize');
            }
        });
        this.typeCaptcha();
    }

    fillPOA() {
        this.checkConsent('authByAttorney');
        this.uploadOneFile();
    }

    checkConsent(labelVal: string) {
        element(by.css(`label[for*="${labelVal}"]`)).click();
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

    checkHasSpouse() {
        return element(by.css('label[for="secondPersonAuthorize"]')).isPresent();
    }

    checkPOA() {
        return element(by.css('input[id="authByAttorney"]')).isSelected();
    }

}