import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MspLogService } from '../../../../services/log.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

describe('Component Test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmationComponent],
      imports: [HttpClientModule, RouterModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })
    ],
      providers: [MspDataService, MspLogService, ActivatedRoute,

      ]
    });
  });
  // it ('should work', () => {
  //   let fixture = TestBed.createComponent(ConfirmationComponent);
  //   expect(fixture.componentInstance instanceof ConfirmationComponent).toBe(true, 'should create ConfirmationComponent');

  // });
});
