import { EnrolmentModule } from './enrolment.module';

describe('EnrolmentModule', () => {
  let enrolmentModule: EnrolmentModule;

  beforeEach(() => {
    enrolmentModule = new EnrolmentModule();
  });

  it('should create an instance', () => {
    expect(enrolmentModule).toBeTruthy();
  });
});
