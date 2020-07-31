import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspPersonCardComponent } from './person-card.component';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { MspAddressCardPartComponent } from '../address-card-part/address-card-part.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {ModalModule} from 'ngx-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';
import { SharedCoreModule } from 'moh-common-lib';

describe('MspPersonCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPersonCardComponent, MspAddressCardPartComponent, ReviewCardComponent],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        RouterTestingModule,
        LocalStorageModule.withConfig({
          prefix: 'ca.bc.gov.msp',
          storageType: 'sessionStorage'
        }),
        SharedCoreModule
      ],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspPersonCardComponent);
    expect(fixture.componentInstance instanceof MspPersonCardComponent).toBe(true, 'should create MspPersonCardComponent');
  });
});
