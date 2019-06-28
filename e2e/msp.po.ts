import { AbstractTestPage } from "moh-common-lib/e2e";
import { browser, element, by } from "protractor";
import { PersonalInfoPageTest } from "./supp-benefits/src/mspsb-supp-benefits.data";

export class BaseMSPTestPage extends AbstractTestPage {

    navigateTo() {

    }

    // This method will be used on both Supp Benefits and Retro PA
    fillPersonalInfo(info: PersonalInfoPageTest) {
        this.typeName('first', info.firstName);
        if(info.middleName){
            this.typeName('middle', info.middleName);
        }
        this.typeName('last', info.lastName);
        const month = info.birthDate.getMonth();
        const year = info.birthDate.getFullYear();
        const day = info.birthDate.getDate();
        element.all(by.css(`select[ng-reflect-name*="month"] option`)).get(month).click();
        this.typeText('day', day.toString());
        this.typeText('year', year.toString());
        this.scrollDown();
        this.typePHN('9999999998');
        this.typeSIN('046454286');
    }

    typeName(ngVal: string, text: string) {
        element(by.css(`common-name[ng-reflect-name*="${ngVal}"] input`)).sendKeys(text);
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
        for(var year = START_YEAR; year < END_YEAR; year++){
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
        element(by.css('div[class="modal-footer"]')).element(by.css('button[type="submit"]')).click();
    }

    /**
     * Checks if the modal is currently displayed or not 
     */
    checkConsentModal() {
        return element(by.css('common-consent-modal')).element(by.css('div[aria-labelledby="myLargeModalLabel"]')).isDisplayed();
    }

}