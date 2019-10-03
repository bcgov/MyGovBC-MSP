import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MspContactCardComponent } from './contact-card.component';
import { MspDataService } from '../../../../services/msp-data.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import {RouterTestingModule} from '@angular/router/testing';
import { MspAddressCardPartComponent } from '../../../../modules/msp-core/components/address-card-part/address-card-part.component';

describe('MspContactCardComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MspContactCardComponent, MspAddressCardPartComponent],
      imports: [FormsModule, RouterTestingModule, LocalStorageModule.withConfig({
        prefix: 'ca.bc.gov.msp',
        storageType: 'sessionStorage'
      })],
      providers: [MspDataService]
    });
  });
  it ('should work', () => {
    const fixture = TestBed.createComponent(MspContactCardComponent);
    expect(fixture.componentInstance instanceof MspContactCardComponent).toBe(true, 'should create MspContactCardComponent');

  });
});
