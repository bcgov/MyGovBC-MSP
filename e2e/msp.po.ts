import { AbstractTestPage } from "moh-common-lib/e2e";
import { browser, element, by, protractor } from "protractor";
import { PersonalInfoPageTest } from "./supp-benefits/src/mspsb-supp-benefits.data";
import { equalParamsAndUrlSegments } from "@angular/router/src/router_state";

export class BaseMSPTestPage extends AbstractTestPage {

    navigateTo() {

    }

    clickOption(value: string) {
        element(by.css(`label[for^="${value}"]`)).click();
    }

    clickRadioButton(labelVal: string, forVal: string){
        element(by.css(`common-radio[ng-reflect-label*="${labelVal}"]`)).element(by.css(`label[for*="${forVal}"]`)).click();
    }

    clickPencilIcon(h2Val: string) {
        element(by.cssContainingText('h2', `${h2Val}`)).element(by.css('i[class*="fa-pencil"]')).click();    
    }

    clickStepper(text: string) {
        element(by.cssContainingText('span', text)).click();
    }

    checkConsent(labelVal: string) {
        element(by.css(`label[for*="${labelVal}"]`)).click();
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

    // This method will be used on both Supp Benefits and Retro PA
    fillPersonalInfo(info: PersonalInfoPageTest) {
        this.typeName('first', info.firstName);
        if(info.middleName){
            this.typeName('middle', info.middleName);
        }
        this.typeName('last', info.lastName);
        // const month = info.birthDate.getMonth(); // Some of the generated months are not working
        if(info.birthDate !== undefined){
            const month = info.birthDate.getMonth();
            const year = info.birthDate.getFullYear();
            const day = info.birthDate.getDate();
            console.log("DATE: ", info.birthDate);
            element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
            this.typeText('day', day.toString());
            this.typeText('year', year.toString());
        }
        this.scrollDown();
        this.typePHN(info.PHN.toString());
        this.typeSIN(info.SIN.toString());
        //046454286
    }

    typeName(ngVal: string, text: string) {
        element(by.css(`common-name[ng-reflect-name*="${ngVal}"] input`)).sendKeys(text);
    }

    typeStreet(idVal: string, text: string) {
        element(by.css(`common-street[id="${idVal}"] input`)).sendKeys(text);
    }

    typeCity(text: string) {
        element(by.css(`common-city[id^="city"] input`)).sendKeys(text);
    }

    typeProvince(text: string) {
        element(by.css('input[id^="province"]')).sendKeys(text);
        element(by.css('input[id^="province"]')).sendKeys(protractor.Key.ENTER);
    }

    typeCountry(text: string) {
        element(by.css('input[id^="country"]')).sendKeys(text);
        element(by.css('input[id^="country"]')).sendKeys(protractor.Key.ENTER);
    }   

    typePostalCode(text: string) {
        element(by.css(`common-postal-code[id^="postal"] input`)).sendKeys(text);
    }

    typePhoneNum(text: string) {
        element(by.css(`common-phone-number input`)).sendKeys(text);
    }

    typePHN(text: string) {
        element(by.css(`common-phn input`)).sendKeys(text);
    }

    typeSIN(text: string) {
        element(by.css(`common-sin input`)).sendKeys(text);
    }

    uploadOneFile(absolutePath = '/space/workspace/MyGovBC-MSP/e2e/sample.jpg') {
        element(by.css('common-file-uploader input[type="file"]')).sendKeys(absolutePath); 
    }

    uploadMultipleFiles(START_YEAR: number, END_YEAR: number, absolutePath = '/space/workspace/MyGovBC-MSP/e2e/sample.jpg') {
        for(var year = START_YEAR; year <= END_YEAR; year++){
            element(by.css(`common-file-uploader[ng-reflect-id="${year}"] input[type="file"]`)).sendKeys(absolutePath);
        }
    }

    // TODO: move to shared lib all the methods below
    /**
     * Navigate to the page given a specific URL
     */
    navigateToURL(PAGE_URL: string) {
        return browser.get('/' + PAGE_URL);
    }

    /**
     * Clicks the checkbox which means the user agrees with the info collection notice.
     * InfoColectionNoticeComponent <common-collection-modal>
     */
    agreeConsentModal() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    /**
     * Clicks continue inside the modal
     * InfoColectionNoticeComponent <common-collection-modal>
     */
    clickConsentModalContinue() {
        element(by.css('common-consent-modal')).element(by.css('button[type="submit"]')).click();
    }

    /**
     * Checks if the modal is currently displayed or not 
     */
    checkConsentModal() {
        return element(by.css('common-consent-modal')).element(by.css('div[aria-labelledby="myLargeModalLabel"]')).isDisplayed();
    }

    checkTitleHeader() {
        return element(by.css('common-header span')).getText();
    }

    checkErrorDisplayed(text: string) {
        return element(by.cssContainingText('div[class="text-danger"]', text)).isPresent();
    }
}