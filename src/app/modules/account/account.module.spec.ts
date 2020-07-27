import { TestBed } from '@angular/core/testing';
import { ProcessService } from '../../services/process.service';
import { AccountModule } from './account.module';

describe('AccountModule', () => {
  let accountModule: AccountModule;

  beforeEach(() => {
    const processServiceStub = () => ({ init: array => ({}) });

    TestBed.configureTestingModule({
      providers: [
        AccountModule,
        { provide: ProcessService, useFactory: processServiceStub }
      ]
    });

    accountModule = TestBed.get(AccountModule);
  });

  it('should create an instance', () => {
    expect(accountModule).toBeTruthy();
  });
});
