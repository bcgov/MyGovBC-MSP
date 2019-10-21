import { browser, by, element, protractor, Key } from 'protractor';
import { PersonalInfoPageTest } from './mspacl.data';
import { BaseMSPTestPage } from '../../msp.po';
/**
 * This class is for GENERAL functions, and all those that target components
 * from the moh-common-lib.  The long-term plan will be to move these over to
 * `moh-common-lib/testing` once created. That way different Angular projects
 * can use the same e2e starting board.
 */

export class RequestPage extends BaseMSPTestPage {

    navigateTo() {
      return browser.get('/msp/account-letter/request-acl');
    }

    fillPage(data: PersonalInfoPageTest) {
      this.fillModal();
      this.typeText('phn', data.PHN.toString());
      this.selectDate('Birthdate', data);
      this.typeText('postal', data.postal);
      this.scrollDown();
      this.clickRadioButton('EnrolmentMembership', 'S');
      this.hasSpecificMember().then(val => {
        if(val){
          this.typePHNForSpecificMember('9982826354');
        }
      });
      this.typeCaptcha();
      this.continue();
    }

    fillModal() {
      this.navigateTo();
      this.clickAgree();
      this.clickModalContinue();
    }

    checkDisplayError(text: string) {
      return element(by.cssContainingText('div', `${text}`)).isPresent();
    }

    clickAgree() {
        element(by.css('label[for="agree"]')).element(by.css('strong')).click();
    }

    clickModalContinue() {
         element(by.cssContainingText('button', 'Continue')).click();
    }

    typeText(idVal: string, text: string) {
      element(by.css(`input[id^="${idVal}"]`)).sendKeys(text);
    }

    selectDate(labelVal: string, data: PersonalInfoPageTest){
      const month = data.birthDate.getMonth();
      const day = data.birthDate.getDate();
      const year = data.birthDate.getFullYear();
      this.typeDate(labelVal, month.toString(), day.toString(), year.toString());
    }

    typeDate(labelVal: string, month: string, day: string, year: string) {
      element(by.css(`common-date[label="${labelVal}"]`)).click();
      element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`option[value="${month}"]`)).click();
      element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`input[id^="day"]`)).sendKeys(day);
      element(by.css(`common-date[label="${labelVal}"]`)).element(by.css(`input[id^="year"]`)).sendKeys(year);
    }

    clickRadioButton(nameVal: string, forVal: string) {
      element(by.css(`common-radio[name="${nameVal}"]`)).element(by.css(`label[for^="${forVal}"]`)).click();
    }

    hasSpecificMember() {
      return element(by.cssContainingText('h2', 'Specific Member Information')).isPresent();
    }

    typePHNForSpecificMember(text: string) {
      element(by.css(`common-phn[name="SpecificMember"] input`)).sendKeys(text);
    }

    typeCaptcha() {
        element(by.css('input[id="answer"]')).sendKeys('irobot');
    }

}
