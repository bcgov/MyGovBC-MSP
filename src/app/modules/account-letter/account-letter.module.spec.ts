import { AccountLetterModule } from './account-letter.module';

describe('AccountLetterModule', () => {
  let accountLetterModule: AccountLetterModule;

  beforeEach(() => {
    accountLetterModule = new AccountLetterModule();
  });

  it('should create an instance', () => {
    expect(accountLetterModule).toBeTruthy();
  });
});
