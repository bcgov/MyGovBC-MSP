import { TestBed } from '@angular/core/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AssistTransformService } from './assist-transform.service';
import { MspDataService } from '../../../services/msp-data.service';

describe('AssistTransformService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ],
    providers: [
      MspDataService
    ]
  }));

  it('should be created', () => {
    const service: AssistTransformService = TestBed.get(AssistTransformService);
    expect(service).toBeTruthy();
  });
});
