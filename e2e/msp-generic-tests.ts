import { browser } from 'protractor';
import { BaseMSPTestPage } from './msp.po';

const page = new BaseMSPTestPage();

export function testGenericAllPages(PageClass: typeof BaseMSPTestPage, PAGE_URL: string){
    let page;

    return describe('Generic Suite for All Pages', () => {
        beforeEach(() => {
            page = new PageClass();
        });

        it('GENERIC TEST 01. should load the page without issue', () => {
            page.navigateToURL(PAGE_URL);
            expect(browser.getCurrentUrl()).toContain(PAGE_URL);
            page.formErrors().count().then(val => {
                expect(val).toBe(0, 'should be no errors on page load');
            });
        });

    });
}

export function testGenericFirstPage(PageClass: typeof BaseMSPTestPage, nextLink: string, urls: {PAGE_URL: string, NEXT_PAGE_URL?: string}){
    let page;

    return describe('Generic Suite for First Page', () => {
        beforeEach(() => {
            page = new PageClass();
        });

        it('GENERIC TEST 02. should NOT let the user to proceed if the user has not agreeed to the info collection notice', () => {
            page.navigateToURL(urls.PAGE_URL);
            page.clickConsentModalContinue();
            page.checkConsentModal().then(val => {
                expect(val).toBe(true);
            });
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });

        it('GENERIC TEST 03. should let the user to proceed if the user has agreeed to the info collection notice', () => {
            this.fillConsentModal(urls.PAGE_URL);
            page.checkConsentModal().then(val => {
                expect(val).toBe(false);
            });
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });

        it('GENERIC TEST 04. should NOT let user continue by clicking the stepper', () => {
            this.fillConsentModal(urls.PAGE_URL);
            page.navigateToURL(urls.PAGE_URL);
            page.clickLink('span', nextLink);
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });

        it('GENERIC TEST 05. should NOT let user to continue if they did not filled out required fields', () => {
            this.fillConsentModal(urls.PAGE_URL);
            page.navigateToURL(urls.PAGE_URL);
            page.continue();
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });
    });
}

export function testGenericSubsequentPage(PageClass: typeof BaseMSPTestPage, links: {prevLink: string, nextLink: string}, urls: {PAGE_URL: string, PREV_PAGE_URL: string, NEXT_PAGE_URL: string}){
    let page;

    return describe('Generic Suite for Subsequent Page', () => {
        beforeEach(() => {
            page = new PageClass();
        });

        it('GENERIC TEST 02. should let user to go back to the previous page by clicking the stepper', () => {
            page.navigateToURL(urls.PAGE_URL);
            page.clickLink('span', links.prevLink);
            expect(browser.getCurrentUrl()).toContain(urls.PREV_PAGE_URL, 'should navigate to the previous page');
        });

        it('GENERIC TEST 03. should NOT let user continue by clicking the stepper', () => {
            page.navigateToURL(urls.PAGE_URL);
            page.clickLink('span', links.nextLink);
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });
    });
}

export function testGenericLastPage(PageClass: typeof BaseMSPTestPage, prevLink: string, urls: {PAGE_URL: string, PREV_PAGE_URL: string}){
    let page;

    return describe('Generic Suite for Last Page', () => {
        beforeEach(() => {
            page = new PageClass();
        });

        it('GENERIC TEST 02. should let user to go back to the previous page by clicking the stepper', () => {
            page.navigateToURL(urls.PAGE_URL);
            page.clickLink('span', prevLink);
            expect(browser.getCurrentUrl()).toContain(urls.PREV_PAGE_URL, 'should navigate to the previous page');
        });

        it('GENERIC TEST 03. should NOT let user to continue if they did not filled out required fields', () => {
            page.navigateToURL(urls.PAGE_URL);
            page.continue();
            expect(browser.getCurrentUrl()).toContain(urls.PAGE_URL, 'should still be on the same page');
        });
    });
}

export function testPageLoad(PAGE_URL: string, pageX?: BaseMSPTestPage) {
    pageX.navigateToURL(PAGE_URL);
        expect(browser.getCurrentUrl()).toContain(PAGE_URL);
        pageX.formErrors().count().then(val => {
            expect(val).toBe(0, 'should be no errors on page load');
        });
}

export function testClickPrevStepper(CURR_PAGE_URL: string, PREV_PAGE_URL: string, prevLink: string) {
    it('GENERIC TEST 02. should let user to go back to the previous page by clicking the stepper', () => {
        page.navigateToURL(CURR_PAGE_URL);
        page.clickLink('span', prevLink);
        expect(browser.getCurrentUrl()).toContain(PREV_PAGE_URL, 'should navigate to the previous page');
    });
}

export function testClickNextStepper(PAGE_URL: string, nextLink: string) {
    it('GENERIC TEST 03. should NOT let user continue by clicking the stepper', () => {
        page.navigateToURL(PAGE_URL);
        page.clickLink('span', nextLink);
        expect(browser.getCurrentUrl()).toContain(PAGE_URL, 'should still be on the same page');
    });
}

export function testClickStepper(CURR_PAGE_URL: string, PREV_PAGE_URL: string, prevLink: string, nextLink: string) {
    testClickPrevStepper(CURR_PAGE_URL, PREV_PAGE_URL, prevLink);
    testClickNextStepper(CURR_PAGE_URL, nextLink);
}

export function testClickContinue(PAGE_URL: string) {
    it('GENERIC TEST 04. should NOT let user to continue if they did not filled out required fields', () => {
        page.navigateToURL(PAGE_URL);
        page.continue();
        expect(browser.getCurrentUrl()).toContain(PAGE_URL, 'should still be on the same page');
    });
}

export function testSkip(CURR_PAGE_URL: string, NEXT_PAGE_URL: string, pageX?: BaseMSPTestPage) {
    it('GENERIC TEST 05. should let user continue or skip without filling out any fields', () => {
        pageX.navigateToURL(CURR_PAGE_URL);
        pageX.continue();
        expect(browser.getCurrentUrl()).toContain(NEXT_PAGE_URL, 'should navigate to the next page');
    });
}

export function fillConsentModal(PAGE_URL: string){
    page.navigateToURL(PAGE_URL);
    page.agreeConsentModal();
    page.clickConsentModalContinue();
}

export function testClickConsentModal(PAGE_URL: string) {
    it('GENERIC TEST 06. should NOT let the user to proceed if the user has not agreeed to the info collection notice', () => {
        page.navigateToURL(PAGE_URL);
        page.clickConsentModalContinue();
        page.checkConsentModal().then(val => {
            expect(val).toBe(true);
        });
        expect(browser.getCurrentUrl()).toContain(PAGE_URL, 'should still be on the same page');
    });

    it('GENERIC TEST 07. should let the user to proceed if the user has agreeed to the info collection notice', () => {
        this.fillConsentModal(PAGE_URL);
        page.checkConsentModal().then(val => {
            expect(val).toBe(false);
        });
        expect(browser.getCurrentUrl()).toContain(PAGE_URL, 'should still be on the same page');
    });
}
