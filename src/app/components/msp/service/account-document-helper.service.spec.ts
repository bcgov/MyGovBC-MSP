import { TestBed } from '@angular/core/testing';

import { AccountDocumentHelperService } from './account-document-helper.service';

describe('AccountDocumentHelperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountDocumentHelperService = TestBed.get(AccountDocumentHelperService);
    expect(service).toBeTruthy();
  });
});
