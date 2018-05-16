import { AppPage } from './app.po';

describe('My GovBC CAPTCHA Widget V2', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('BC Gov. CAPTCHA Widget Source Code and Demo');
  });
});
