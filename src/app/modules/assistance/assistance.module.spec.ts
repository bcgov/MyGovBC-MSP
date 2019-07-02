import { AssistanceModule } from './assistance.module';

describe('AssistanceModule', () => {
  let assistanceModule: AssistanceModule;

  beforeEach(() => {
    assistanceModule = new AssistanceModule();
  });

  it('should create an instance', () => {
    expect(assistanceModule).toBeTruthy();
  });
});
