import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AssistStateService } from './assist-state.service';
import { MspDataService } from '../../../services/msp-data.service';
import { MspLogService } from 'app/services/log.service';

describe('AssistStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),
      HttpClientTestingModule
    ],
    providers: [
      MspDataService,
      MspLogService
    ]
  }));

  it('should be created', () => {
    const service: AssistStateService = TestBed.get(AssistStateService);
    expect(service).toBeTruthy();
  });
});
