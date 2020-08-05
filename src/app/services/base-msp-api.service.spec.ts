import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseMspApiService } from './base-msp-api.service';
import { MspLogService } from './log.service';
import { MspDataService } from './msp-data.service';

describe('BaseMspApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      }),
      RouterTestingModule
    ],
    providers: [
      MspLogService,
      MspDataService
    ]
  }));

  it('should be created', () => {
    const service: BaseMspApiService = TestBed.get(BaseMspApiService);
    expect(service).toBeTruthy();
  });
});
