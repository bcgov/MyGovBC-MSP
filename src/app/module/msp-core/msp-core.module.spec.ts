import { MspCoreModule } from './msp-core.module';

describe('CoreModule', () => {
  let coreModule: MspCoreModule;

  beforeEach(() => {
    coreModule = new MspCoreModule();
  });

  it('should create an instance', () => {
    expect(MspCoreModule).toBeTruthy();
  });
});
