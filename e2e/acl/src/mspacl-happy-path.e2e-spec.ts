
import { browser } from 'protractor';
import { FakeDataACL } from './mspacl.data';
import { RequestPage } from './mspacl.po';   
import { fillConsentModal } from '../../msp-generic-tests';

describe('MSP ACL Page - End to End Test (Happy Path)', () => {
    let requestPage: RequestPage;
    const data = new FakeDataACL;
    let personalInfoData;
    const CONFIRMATION_PAGE_URL = `msp/account-letter/confirmation`;

    beforeEach(() => {
        requestPage = new RequestPage();
        personalInfoData = data.personalInfo();
        data.setSeed();
    });

    it('01. should successfully submit an application for MSP ACL', () => {
        requestPage.fillPage(personalInfoData);
        expect(browser.getCurrentUrl()).toContain(CONFIRMATION_PAGE_URL, 'should be able to succesfully submit the form');
    }, 120000);
});