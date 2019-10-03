import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspPersonCardComponent } from './person-card.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {MspAddressCardPartComponent} from '../address-card-part/address-card-part.component';
import {ModalModule} from 'ngx-bootstrap';
import {RouterTestingModule} from '@angular/router/testing';

describe('MspPersonCardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspPersonCardComponent, MspAddressCardPartComponent],
      imports: [FormsModule, ModalModule.forRoot(), RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspPersonCardComponent);
    expect(fixture.componentInstance instanceof MspPersonCardComponent).toBe(true, 'should create MspPersonCardComponent');
  });
});
