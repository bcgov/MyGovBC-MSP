import { RequestAclModule } from './request-acl.module';

describe('RequestAclModule', () => {
  let requestAclModule: RequestAclModule;

  beforeEach(() => {
    requestAclModule = new RequestAclModule();
  });

  it('should create an instance', () => {
    expect(requestAclModule).toBeTruthy();
  });
});
