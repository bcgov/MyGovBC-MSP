import { TestBed, async, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageModule } from 'angular-2-local-storage';
import { AssistGuard } from './assist.guard';
import { MspDataService } from '../../../services/msp-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssistGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        HttpClientTestingModule
      ],
      providers: [
        AssistGuard,
        MspDataService
      ]
    });
  });

  it('should ...', inject([AssistGuard], (guard: AssistGuard) => {
    expect(guard).toBeTruthy();
  }));
});
