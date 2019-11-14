import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MspCancelComponent } from './cancel.component';
import {MspDataService} from '../../../../services/msp-data.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';

import { MspLogService } from '../../../../services/log.service';
import {ModalModule} from 'ngx-bootstrap';
import {HttpClientModule} from '@angular/common/http';
import { MspAddressCardPartComponent } from '../../../../modules/msp-core/components/address-card-part/address-card-part.component';
describe('MspCancelComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspCancelComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule,  HttpClientModule, LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
      }),
          ModalModule.forRoot()],
      providers: [MspDataService, MspLogService,
        LocalStorageService
      ]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspCancelComponent);
    expect(fixture.componentInstance instanceof MspCancelComponent).toBe(true, 'should create MspCancelComponent');

  });
});
