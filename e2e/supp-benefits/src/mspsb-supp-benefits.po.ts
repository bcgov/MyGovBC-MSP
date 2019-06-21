import { browser, by, element, WebElement, protractor, Key } from 'protractor';
import { AbstractTestPage } from 'moh-common-lib/e2e';
import { PersonalInfoPageTest, ContactInfoPageTest } from './mspsb-supp-benefits.data';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */
export class BaseMSPSuppBenefitsTestPage extends AbstractTestPage {

    protected diffMailAddressButton: WebElement = element(by.css('.mail-address-container .btn'));
    protected diffMailAddressCheckbox: WebElement = element(by.css('.custom-checkbox .custom-control-label'));

    navigateTo() {
        return browser.get('/msp/');
    }

    /**
     * * Clicks the checkbox which means the user agrees with the info collection notice.
     * InfoColectionNoticeComponent <common-collection-modal>
     */
    agreeConsentModal() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    /**
     * * Clicks continue inside the modal
     * InfoColectionNoticeComponent <common-collection-modal>
     */
    clickConsentModalContinue() {
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
    }

    /**
     * * Checks if the modal is currently displayed or not 
     */
    checkConsentModal() {
        return element(by.css('common-consent-modal')).element(by.css('div[aria-labelledby="myLargeModalLabel"]')).isDisplayed();
    }

    clickOption(value: string) {
        element(by.css(`label[for="${value}"]`)).click();
    }

    clickButton(val: string) {
        element(by.css(`common-button[ng-reflect-label="${val}"]`)).element(by.cssContainingText('span', `${val}`)).click();
    }

    clickRadioButton(labelVal: string, forVal: string){
        element(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).element(by.css(`label[for*="${forVal}"]`)).click();
    }

    typeName(ngVal: string, text: string) {
        element(by.css(`common-name[ng-reflect-name*="${ngVal}"] input`)).sendKeys(text);
    }

    typePHN(text: string) {
        element(by.css(`common-phn input`)).sendKeys(text);
    }

    // TODO: move to shared lib
    uploadFile(absolutePath = '/space/workspace/MyGovBC-MSP/e2e/sample.jpg') {
        element(by.css('common-file-uploader input[type="file"]')).sendKeys(absolutePath); 
    }

    clickDiffMailAddress() {
        this.diffMailAddressButton.click();
    }

    checkDiffMailAddress() {
        this.diffMailAddressCheckbox.click();
    }
}

export class PreparePage extends BaseMSPSuppBenefitsTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/prepare');
    }

    typeNetIncome(val: string) {
        element(by.css('input[id="netIncome"]')).sendKeys(val);
    }

}

export class PersonalInfoPage extends BaseMSPSuppBenefitsTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/personal-info');
    }

    fillInfo(info: PersonalInfoPageTest) {
        this.typeName('first_name', info.firstName);
        if(info.middleName){
            this.typeName('middle_name', info.middleName);
        }
        this.typeName('last_name', info.lastName);
        const month = info.birthDate.getMonth();
        const year = info.birthDate.getFullYear();
        const day = info.birthDate.getDate();
        element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
        this.typeText('day', day.toString());
        this.typeText('year', year.toString());
        this.scrollDown();
        this.typePHN('9999999998');
        this.typeText('sin', '712234123');
        this.uploadFile();
    }

}

export class SpouseInfoPage extends PersonalInfoPage {

    navigateTo() {
        return browser.get('/msp/benefit/spouse-info');
    }

    addSpouse() {
        element(by.css('common-button[ng-reflect-label*="Add Spouse"] span')).click();
    }

}

export class ContactInfoPage extends BaseMSPSuppBenefitsTestPage {

    navigateTo() {
        return browser.get('/msp/benefit/contact-info');
    }

    fillMailingAddress(data: ContactInfoPageTest) {
        element(by.css('common-address:nth-child(1) [id^="street"]')).sendKeys(data.address);
        element(by.css('common-address:nth-child(1) [id^="city"]')).sendKeys(data.city);
        element(by.css('common-address:nth-child(1) [id^="postal"]')).sendKeys(data.postal);
    }

    fillContactNumber(data: ContactInfoPageTest) {
        element(by.css('input[id^="phone"]')).sendKeys(data.mobile);
    }
}